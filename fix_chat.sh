#!/bin/bash
cat << 'INNER_EOF' > src/components/ChatWidget.tsx
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Phone, PhoneOff, MicOff, Mic, X, User, Globe } from 'lucide-react';
import { auth } from '../lib/firebase';

interface ChatMessage {
  id: string;
  senderId: string;
  senderEmail: string;
  text: string;
  timestamp: number;
}

interface PeerPresence {
  uid: string;
  email: string;
  lastSeen: number;
}

export function ChatWidget({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [peers, setPeers] = useState<Record<string, PeerPresence>>({});
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'chat'>('users');
  
  const [incomingCall, setIncomingCall] = useState<{ callerId: string, callerEmail: string, offer: any } | null>(null);
  const [activeCall, setActiveCall] = useState<{ peerId: string, peerEmail: string } | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const pcsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;
    
    let reconnectTimer: NodeJS.Timeout;
    
    const connectWebSocket = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/p2p`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      let heartbeat: NodeJS.Timeout;

      ws.onopen = () => {
        console.log("WebSocket connected");
        ws.send(JSON.stringify({
          type: 'presence',
          uid: currentUser.uid,
          email: currentUser.email
        }));
        
        heartbeat = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'presence',
              uid: currentUser.uid,
              email: currentUser.email
            }));
          }
        }, 5000);
      };

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'presence' && data.uid !== currentUser.uid) {
            setPeers(prev => ({
              ...prev,
              [data.uid]: { uid: data.uid, email: data.email, lastSeen: Date.now() }
            }));
          }
          
          if (data.type === 'chat') {
            setMessages(prev => [...prev, data.message]);
          }

          if (data.target === currentUser.uid) {
            if (data.type === 'offer') {
              setIncomingCall({ callerId: data.senderId, callerEmail: data.senderEmail, offer: data.offer });
            } else if (data.type === 'answer') {
              const pc = pcsRef.current.get(data.senderId);
              if (pc) await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
            } else if (data.type === 'ice-candidate') {
              const pc = pcsRef.current.get(data.senderId);
              if (pc) await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
            } else if (data.type === 'end-call') {
              endCallLocally(data.senderId);
            } else if (data.type === 'teacher-offer') {
              const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
              pcsRef.current.set(data.teacherId, pc);

              if (localStreamRef.current) {
                 localStreamRef.current.getTracks().forEach(t => pc.addTrack(t, localStreamRef.current!));
              }
              
              pc.ontrack = (e) => {
                 const audio = new Audio();
                 audio.autoplay = true;
                 audio.srcObject = e.streams[0];
              };

              pc.onicecandidate = (e) => {
                 if (e.candidate && wsRef.current) {
                     wsRef.current.send(JSON.stringify({ type: 'ice-candidate-teacher', target: data.teacherId, candidate: e.candidate, senderId: currentUser.uid }));
                 }
              };

              await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              wsRef.current.send(JSON.stringify({ type: 'teacher-answer', target: data.teacherId, senderId: currentUser.uid, answer }));
            }
          }
        } catch (err) {
          console.error(err);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected. Reconnecting in 3 seconds...");
        clearInterval(heartbeat);
        reconnectTimer = setTimeout(connectWebSocket, 3000);
      };
      
      ws.onerror = () => {
         ws.close();
      };
    };

    connectWebSocket();

    return () => {
      clearTimeout(reconnectTimer);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
      endAllCallsLocally();
    };
  }, [currentUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPeers(prev => {
        const now = Date.now();
        const updated = { ...prev };
        for (const key in updated) {
          if (now - updated[key].lastSeen > 15000) {
            delete updated[key];
          }
        }
        return updated;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser || !wsRef.current) return;
    
    const msg: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.uid,
      senderEmail: currentUser.email || 'Anonim',
      text: inputText,
      timestamp: Date.now()
    };

    wsRef.current.send(JSON.stringify({
      type: 'chat',
      message: msg
    }));
    setMessages(prev => [...prev, msg]);
    setInputText('');
  };

  const setupWebRTC = async (peerId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    pcsRef.current.set(peerId, pc);

    try {
      if (!localStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = stream;
      }
      localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current!));
    } catch (err) {
      console.error("Microphone error", err);
      alert("Tidak dapat mengakses mikrofon.");
      return null;
    }

    pc.ontrack = (event) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current) {
        wsRef.current.send(JSON.stringify({
          type: 'ice-candidate',
          target: peerId,
          senderId: currentUser?.uid,
          candidate: event.candidate
        }));
      }
    };

    return pc;
  };

  const startCall = async (peerId: string, peerEmail: string) => {
    if (activeCall) return;
    const pc = await setupWebRTC(peerId);
    if (!pc) return;

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      if (wsRef.current && currentUser) {
        wsRef.current.send(JSON.stringify({
          type: 'offer',
          target: peerId,
          senderId: currentUser.uid,
          senderEmail: currentUser.email,
          offer: offer
        }));
        
        wsRef.current.send(JSON.stringify({
          type: 'call-started',
          callerId: currentUser.uid,
          callerEmail: currentUser.email,
          receiverId: peerId,
          receiverEmail: peerEmail
        }));
      }

      setActiveCall({ peerId, peerEmail });
      startCallTimer();
    } catch (err) {
      console.error(err);
      endCallLocally(peerId);
    }
  };

  const acceptCall = async () => {
    if (!incomingCall || !currentUser) return;
    const peerId = incomingCall.callerId;
    
    const pc = await setupWebRTC(peerId);
    if (!pc) return;

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      if (wsRef.current) {
        wsRef.current.send(JSON.stringify({
          type: 'answer',
          target: peerId,
          senderId: currentUser.uid,
          answer: answer
        }));
      }

      setActiveCall({ peerId, peerEmail: incomingCall.callerEmail });
      setIncomingCall(null);
      startCallTimer();
    } catch (err) {
      console.error(err);
      endCallLocally(peerId);
    }
  };

  const rejectCall = () => {
    if (incomingCall && wsRef.current && currentUser) {
      wsRef.current.send(JSON.stringify({
        type: 'end-call',
        target: incomingCall.callerId,
        senderId: currentUser.uid
      }));
    }
    setIncomingCall(null);
  };

  const endAllCallsLocally = () => {
    setActiveCall(null);
    setIncomingCall(null);
    clearInterval(callTimerRef.current!);
    
    pcsRef.current.forEach(pc => pc.close());
    pcsRef.current.clear();
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
  };

  const endCallLocally = (peerId: string) => {
    if (activeCall?.peerId === peerId) {
      setActiveCall(null);
      clearInterval(callTimerRef.current!);
    }
    
    const pc = pcsRef.current.get(peerId);
    if (pc) {
      pc.close();
      pcsRef.current.delete(peerId);
    }
    
    if (pcsRef.current.size === 0 && localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
  };

  const endCall = () => {
    if (activeCall && wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'end-call',
        target: activeCall.peerId,
        senderId: currentUser?.uid
      }));
      
      wsRef.current.send(JSON.stringify({
        type: 'call-ended',
        callerId: currentUser?.uid
      }));
      
      endCallLocally(activeCall.peerId);
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const startCallTimer = () => {
    setCallDuration(0);
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return \`\${m}:\${s}\`;
  };

  return (
    <>
      <audio ref={remoteAudioRef} autoPlay />
      
      {/* Incoming Call Modal */}
      {incomingCall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Phone size={32} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Panggilan Masuk</h3>
            <p className="text-slate-400 mb-8">{incomingCall.callerEmail}</p>
            
            <div className="flex gap-4 w-full">
              <button onClick={rejectCall} className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-colors">Tolak</button>
              <button onClick={acceptCall} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors">Terima</button>
            </div>
          </div>
        </div>
      )}

      {/* Active Call Panel */}
      {activeCall && (
        <div className="fixed bottom-6 right-6 z-[90] bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-2xl w-64 animate-in slide-in-from-bottom-8">
          <div className="flex justify-between items-center mb-3">
            <div className="truncate pr-4">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Panggilan Aktif</div>
              <div className="text-sm text-white font-medium truncate">{activeCall.peerEmail}</div>
            </div>
            <div className="text-emerald-400 font-mono text-sm">{formatTime(callDuration)}</div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={toggleMute}
              className={\`flex-1 py-2 rounded-lg flex justify-center items-center transition-colors \${isMuted ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}\`}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button 
              onClick={endCall}
              className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg flex justify-center items-center transition-colors"
            >
              <PhoneOff size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Drawer */}
      <div className={\`fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl z-40 transform transition-transform duration-300 flex flex-col \${isOpen ? 'translate-x-0' : 'translate-x-full'}\`}>
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <h2 className="font-bold uppercase tracking-widest text-slate-100 flex items-center gap-2">
            <Globe size={18} className="text-indigo-500" /> Jaringan Kafilah
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-slate-800">
          <button 
            className={\`flex-1 py-3 text-sm font-bold uppercase tracking-wider \${activeTab === 'users' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:bg-slate-800'}\`}
            onClick={() => setActiveTab('users')}
          >
            Online ({Object.keys(peers).length})
          </button>
          <button 
            className={\`flex-1 py-3 text-sm font-bold uppercase tracking-wider \${activeTab === 'chat' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:bg-slate-800'}\`}
            onClick={() => setActiveTab('chat')}
          >
            Obrolan Global
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'users' && (
            <div className="space-y-2">
              {Object.values(peers).length === 0 ? (
                <p className="text-slate-500 text-center py-8 text-sm italic">Belum ada rekan yang online.</p>
              ) : (
                Object.values(peers).map(peer => (
                  <div key={peer.uid} className="flex justify-between items-center p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3 truncate pr-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                      <span className="text-sm text-slate-200 truncate">{peer.email}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setActiveTab('chat')} className="p-2 hover:bg-slate-700 text-indigo-400 rounded transition-colors" title="Chat">
                        <MessageSquare size={16} />
                      </button>
                      <button 
                        onClick={() => startCall(peer.uid, peer.email)}
                        disabled={activeCall !== null}
                        className="p-2 hover:bg-emerald-900/50 text-emerald-400 rounded transition-colors disabled:opacity-50" 
                        title="Telepon"
                      >
                        <Phone size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.length === 0 ? (
                  <p className="text-slate-500 text-center py-8 text-sm italic">Belum ada pesan.</p>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.senderId === currentUser?.uid;
                    return (
                      <div key={msg.id} className={\`flex flex-col max-w-[85%] \${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}\`}>
                        <div className="text-[10px] text-slate-500 mb-1 px-1">{isMe ? 'Anda' : msg.senderEmail}</div>
                        <div className={\`p-3 rounded-2xl text-sm shadow-md \${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'}\`}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={sendChatMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Ketik pesan..." 
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors">Kirim</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
INNER_EOF
bash fix_chat.sh
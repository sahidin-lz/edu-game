import fs from 'fs';

let content = fs.readFileSync('src/components/DashboardGuru.tsx', 'utf-8');

// 1. Add ukhuwah and logs to students object
content = content.replace(
  /status: state\.status_kota \|\| "Aman",/g,
  'status: state.status_kota || "Aman",\n          ukhuwah: state.ukhuwah || 0,\n          logs: data.logs || [],'
);

// 2. Add selectedStudent state
content = content.replace(
  /const \[studentList, setStudentList\] = useState<any\[\]>\(\[\]\);/g,
  'const [studentList, setStudentList] = useState<any[]>([]);\n  const [selectedStudent, setSelectedStudent] = useState<any>(null);'
);

// 3. Add getAkademikPersona import
if (!content.includes('getAkademikPersona')) {
  content = content.replace(
    /import { auth, db } from '\.\.\/lib\/firebase';/,
    "import { auth, db } from '../lib/firebase';\nimport { getAkademikPersona } from '../utils/persona';\nimport { Target, Map, ShieldAlert, User, GraduationCap, History } from 'lucide-react';"
  );
}

// 4. Update the TR to be clickable
content = content.replace(
  /<tr key=\{s\.id\} className="border-b border-slate-800\/50 hover:bg-slate-800\/30 transition-colors">/g,
  '<tr key={s.id} onClick={() => setSelectedStudent(s)} className="border-b border-slate-800/50 hover:bg-slate-800/50 cursor-pointer transition-colors">'
);

// 5. Inject the Modal before the final closing div
const modalCode = `
      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
            
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-800 bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border-2 border-emerald-500 flex items-center justify-center">
                  <User size={24} className="text-slate-400" />
                </div>
                <div>
                  <h2 className="font-bold text-lg tracking-widest uppercase text-emerald-400">{selectedStudent.nama}</h2>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Level {selectedStudent.level} • {selectedStudent.status}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              
              {/* PROFIL AKADEMIK / PERSONA */}
              <div className="bg-slate-950/80 border border-slate-700 rounded-xl p-5 mb-8 shadow-inner">
                <h3 className="text-xs uppercase font-bold tracking-widest text-slate-500 flex items-center gap-2 mb-4">
                  <Target size={14} className="text-amber-400" /> Profil Akademik Siswa
                </h3>
                
                {(() => {
                  const persona = getAkademikPersona(selectedStudent.sosiologi, selectedStudent.akhlak, selectedStudent.ukhuwah);
                  return (
                    <div className="text-center mb-6">
                      <h1 className={\`text-2xl font-black uppercase tracking-widest \${persona.color} mb-2\`}>{persona.title}</h1>
                      <p className="text-xs text-slate-400 italic leading-relaxed">"{persona.desc}"</p>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Sosiologi (Faham)</div>
                    <div className="text-2xl font-black text-blue-400">{selectedStudent.sosiologi}</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Agama (Hifdz)</div>
                    <div className="text-2xl font-black text-emerald-400">{selectedStudent.akhlak}</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-center">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Sosial (Ukhuwah)</div>
                    <div className="text-2xl font-black text-indigo-400">{selectedStudent.ukhuwah}</div>
                  </div>
                </div>
              </div>

              {/* RIWAYAT LOGS */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs uppercase font-bold tracking-widest text-slate-300 flex items-center gap-2">
                  <History size={14} className="text-amber-400" /> Misi Diselesaikan
                </h3>
              </div>
              
              <div className="space-y-4">
                {(() => {
                  const dilemmas: any[] = [];
                  let currentDilemma: any = {};
                  (selectedStudent.logs || []).forEach((log: any) => {
                    if (log.type === 'narrative') {
                      if (currentDilemma.narrative) { dilemmas.push(currentDilemma); currentDilemma = {}; }
                      currentDilemma.narrative = log;
                    } else if (log.type === 'player_action') {
                      currentDilemma.action = log;
                    } else if (log.type === 'evaluation') {
                      currentDilemma.evaluation = log;
                      dilemmas.push(currentDilemma);
                      currentDilemma = {};
                    }
                  });
                  if (currentDilemma.narrative && !dilemmas.includes(currentDilemma)) dilemmas.push(currentDilemma);
                  const reversed = [...dilemmas].reverse();
                  
                  if (reversed.length === 0) return <div className="text-center py-4 opacity-50 text-slate-400 text-sm">Belum ada riwayat.</div>;
                  
                  return reversed.map((d, i) => (
                    <div key={i} className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                      {d.narrative && <p className="text-xs text-slate-300 italic mb-2 line-clamp-2">{d.narrative.content}</p>}
                      {d.action && <p className="text-xs text-blue-300 mb-2 border-l-2 border-blue-500 pl-2">Tindakan: "{d.action.content}"</p>}
                      {d.evaluation && (
                        <p className="text-[10px] text-emerald-400 bg-emerald-950/30 p-2 rounded">
                          Evaluasi: {d.evaluation.evaluation?.evaluasi?.saran_guru || 'Diselesaikan'}
                        </p>
                      )}
                    </div>
                  ));
                })()}
              </div>
              
            </div>
          </div>
        </div>
      )}
`;

content = content.replace(/    <\/div>\n  \);\n}/, modalCode + '    </div>\n  );\n}');

fs.writeFileSync('src/components/DashboardGuru.tsx', content);

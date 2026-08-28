import re

with open('src/components/QuestBoard.tsx', 'r') as f:
    content = f.read()

# Add useRef
content = content.replace("import React, { useState } from 'react';", "import React, { useState, useRef, useEffect } from 'react';")

# Find the QuestBoard component start
comp_start = content.find("export function QuestBoard(")

# Insert scrollRef and useEffect right after state declarations
state_declarations = "const [viewMode, setViewMode] = useState<'map' | 'list'>('map');"
state_decl_idx = content.find(state_declarations) + len(state_declarations)

insert_code = """
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && viewMode === 'map' && scrollContainerRef.current) {
      // Find the first available or active quest
      const activeIndex = gameState.quests.findIndex(q => q.status === 'available');
      if (activeIndex !== -1) {
        const pos = getQuestPosition(activeIndex);
        // pos.y is in px, pos.x is in %
        scrollContainerRef.current.scrollTo({
          top: Math.max(0, pos.y - scrollContainerRef.current.clientHeight / 2),
          behavior: 'smooth'
        });
      }
    }
  }, [isOpen, viewMode, gameState.quests]);
"""

content = content[:state_decl_idx] + insert_code + content[state_decl_idx:]

# Find the content area div and add the ref
content_area_str = '<div className="flex-1 overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent bg-slate-950">'
content = content.replace(content_area_str, '<div ref={scrollContainerRef} className="flex-1 overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent bg-slate-950">')

with open('src/components/QuestBoard.tsx', 'w') as f:
    f.write(content)

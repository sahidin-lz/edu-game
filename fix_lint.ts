import fs from 'fs';

let content = fs.readFileSync('src/components/DashboardGuru.tsx', 'utf-8');
content = content.replace(
  /import \{ auth, db \} from '\.\.\/lib\/firebase';\nimport \{ getAkademikPersona \} from '\.\.\/utils\/persona';\nimport \{ Target, Map, ShieldAlert, User, GraduationCap, History \} from 'lucide-react';/,
  "import { auth, db } from '../lib/firebase';\nimport { getAkademikPersona } from '../utils/persona';\nimport { Target, Map, User, GraduationCap, History } from 'lucide-react';"
);

fs.writeFileSync('src/components/DashboardGuru.tsx', content);

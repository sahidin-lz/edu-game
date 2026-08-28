import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

const extractJsonFn = `
function extractJson(text: string) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  const arrStart = text.indexOf('[');
  const arrEnd = text.lastIndexOf(']');
  
  let startIndex = -1;
  let endIndex = -1;
  
  if (start !== -1 && end !== -1 && (arrStart === -1 || start < arrStart)) {
      startIndex = start;
      endIndex = end;
  } else if (arrStart !== -1 && arrEnd !== -1) {
      startIndex = arrStart;
      endIndex = arrEnd;
  }
  
  if (startIndex !== -1 && endIndex !== -1 && endIndex >= startIndex) {
    return JSON.parse(text.substring(startIndex, endIndex + 1));
  }
  
  return JSON.parse(text.replace(/\\s*\`\`\`json\\s*/g, '').replace(/\\s*\`\`\`\\s*/g, '').trim());
}
`;

if (!content.includes('function extractJson')) {
  // Add it after the imports
  content = content.replace(/const PORT = 3000;/, `const PORT = 3000;\n${extractJsonFn}`);
}

content = content.replace(/const result = JSON\.parse\(responseText\);/g, 'const result = extractJson(responseText);');
content = content.replace(/const jsonStr = response\.text\.replace[^;]+;/, '');
content = content.replace(/const quest = JSON\.parse\(jsonStr\);/g, 'const quest = extractJson(response.text);');

fs.writeFileSync('server.ts', content);
console.log('Fixed server.ts');

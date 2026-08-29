import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

if (!content.includes("import { INVENTORY_ITEMS, SHOP_ITEMS } from './data/items';")) {
  content = content.replace(
    /import \{ scenarioBank \} from '\.\/data\/scenarioData';/,
    `import { scenarioBank } from './data/scenarioData';\nimport { INVENTORY_ITEMS, SHOP_ITEMS } from './data/items';`
  );
}

const originalHandleEquip = `  const handleEquip = (type: 'alasKaki' | 'pakaian', itemId: string) => {
    import('./data/items').then(({ INVENTORY_ITEMS }) => {
      const item = INVENTORY_ITEMS.find(i => i.id === itemId);
      if (item) {
        setGameState(prev => {
          const newState = { ...prev, equipment: { ...prev.equipment, [type]: itemId } };
          if (item.effect.maxEnergi) {
            newState.maxEnergi = (newState.maxEnergi || 100) + item.effect.maxEnergi;
            newState.energi = Math.min(newState.energi + item.effect.maxEnergi, newState.maxEnergi);
          }
          if (item.effect.ukhuwah) newState.ukhuwah = Math.min(100, newState.ukhuwah + item.effect.ukhuwah);
          if (item.effect.faham) newState.faham = Math.min(100, newState.faham + item.effect.faham);
          saveToFirebase(newState, logs);
          return newState;
        });
      }
    });
  };`;

const newHandleEquip = `  const handleEquip = (type: 'alasKaki' | 'pakaian', itemId: string) => {
    const item = INVENTORY_ITEMS.find(i => i.id === itemId);
    if (item) {
      setGameState(prev => {
        const newState = { ...prev, equipment: { ...prev.equipment, [type]: itemId } };
        if (item.effect.maxEnergi) {
          newState.maxEnergi = (newState.maxEnergi || 100) + item.effect.maxEnergi;
          newState.energi = Math.min(newState.energi + item.effect.maxEnergi, newState.maxEnergi);
        }
        if (item.effect.ukhuwah) newState.ukhuwah = Math.min(100, newState.ukhuwah + item.effect.ukhuwah);
        if (item.effect.faham) newState.faham = Math.min(100, newState.faham + item.effect.faham);
        saveToFirebase(newState, logs);
        return newState;
      });
    }
  };`;

const originalHandleBuy = `  const handleBuy = (itemId: string) => {
    import('./data/items').then(({ SHOP_ITEMS }) => {
      const item = SHOP_ITEMS.find(i => i.id === itemId);
      if (item && gameState.uang_qris >= item.price) {
        setGameState(prev => {
          const newState = {
            ...prev,
            uang_qris: Math.max(0, prev.uang_qris - item.price),
            energi: Math.min(prev.maxEnergi || 100, prev.energi + (item.effect.energi || 0)),
            ukhuwah: Math.min(100, prev.ukhuwah + (item.effect.ukhuwah || 0))
          };
          saveToFirebase(newState, logs);
          return newState;
        });
      }
    });
  };`;

const newHandleBuy = `  const handleBuy = (itemId: string) => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (item && gameState.uang_qris >= item.price) {
      setGameState(prev => {
        const newState = {
          ...prev,
          uang_qris: Math.max(0, prev.uang_qris - item.price),
          energi: Math.min(prev.maxEnergi || 100, prev.energi + (item.effect.energi || 0)),
          ukhuwah: Math.min(100, prev.ukhuwah + (item.effect.ukhuwah || 0))
        };
        saveToFirebase(newState, logs);
        return newState;
      });
    }
  };`;

content = content.replace(originalHandleEquip, newHandleEquip);
content = content.replace(originalHandleBuy, newHandleBuy);

fs.writeFileSync('src/App.tsx', content);

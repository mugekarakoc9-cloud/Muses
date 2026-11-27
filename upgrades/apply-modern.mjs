import fs from 'node:fs';
for(const [target,part,marker] of [['p1-studio.js','upgrades/modern-1611.js','/* MUSES 0.16.11 modern Reader.'],['p1-studio.css','upgrades/modern-1611.css','/* One responsive visual language;']]){
 let source=fs.readFileSync(target,'utf8');const at=source.indexOf(marker);if(at>=0)source=source.slice(0,at);fs.writeFileSync(target,source.trimEnd()+'\n\n'+fs.readFileSync(part,'utf8'));
}

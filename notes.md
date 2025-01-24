npx create-next-app@latest   --> install command
ls   --> terminal – show root, vypis directiories
cd --> change directory
cd .. --> posunie nas o uroven vyzsie
npm run dev --> zapinanie projektu
npm install @mui/material @emotion/react @emotion/styled --> install mui libarry (html a css)
git init --> inicializacia gitu
git branch -m <name> --> zmeni meno git main brainchu
git config --global user.name "your name“ --> nastavime user name
git config --global user.email "your email" --> nastavime user email
git remote add origin https://github.com/your_username/project_name.git --> nastavite svoj projekt
git add . --> vlozite vsetky files z filu, ktory ste nastavili
git commit -m "Initial commit" --> commit changes

- Node js vzdy zobrazuje stranku, ktora sa musi volat page.tsx a musi byt v app priecinku. Ako home stranku zobrazu tu, ktora je len v app priecinku a nie je zabalena nejakym inym priecinkom. Preto na home priecinok dame () --> (home) lebo router home priecinok „nevidi“ ak je v zatvrokach a page vnom zonbere ako default.

Next.js rezervovane nazvy --> layout.tsx, not-found.tsx, page.tsx

-routing --> 
npm run build --> skompiluje a vytvori production server na localhoste, vzdy zapnut pred commit/sync aby sa errors nedostali na production server

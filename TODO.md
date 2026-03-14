# Render Deployment TODO

## ✅ Prep Files (Automated)
- [x] Create .gitignore
- [x] Create .env.example  
- [x] Update server.js CORS
- [x] Create this TODO.md

## 🔄 Git Setup  
- [ ] `git init` (if no repo)
- [ ] `git add .`  
- [ ] `git commit -m "Prep Render deploy"`
- [ ] Create GitHub repo, `git remote add origin <url>`
- [ ] `git push -u origin main`

## 🟢 Render Deploy
- [ ] render.com account → New Web Service → Connect GitHub repo
- [ ] Settings: Build `npm install`, Start `npm start`
- [ ] Environment: MONGODB_URI (your Atlas), JWT_SECRET=random32chars
- [ ] Deploy → URL ready

## 🧪 Local Test First
- [ ] `taskkill /PID 11968 /F`
- [ ] `node server.js` 
- [ ] `curl http://localhost:5000/api/health`
- [ ] `curl -X POST http://localhost:5000/api/auth/login -d "{\"email\":\"test@test.com\",\"password\":\"password\"}" -H "Content-Type: application/json"`

## 🟢 Render Test
- [ ] `<render-url>/api/health`
- [ ] POST `/api/auth/login`
- [ ] Update frontend CORS if needed

## 🚀 Done!


<div align="center">

![header](https://capsule-render.vercel.app/api?type=wave&color=000000&height=300&section=header&text=WeLog&fontSize=80&fontColor=ffffff)

<br>

## Markdown 기반 생산적 블로그 플랫폼 'WeLog'

📝 누구나 마크다운으로 글을 작성하고, 지식을 공유할 수 있는 블로그 플랫폼입니다.  
🌙 개인 기록이 아닌, 공유 중심의 생산적인 글쓰기 경험에 집중합니다.   
<br>
<img src="https://github.com/sohwakyeong/Data/blob/main/weLog.png?raw=true" width="80%" alt="WeLog 메인화면"/>

<br>

## 개발 기간

2025년 4월 27일 - 2025년 5월 02일 
🛠 배포 완료

🔗 **배포 주소**: [https://hk-blog-l4lu.vercel.app](https://hk-blog-l4lu.vercel.app)

<br>

## 🛠 기술 스택

<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
<img src="https://img.shields.io/badge/ToastUI_Editor-FFB400?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=Zustand&logoColor=white"/>
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white"/>
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel"/>

<br>

## 주요 기능

### 🔐 회원가입 / 로그인  
이메일 기반으로 Supabase Auth를 이용한 회원가입과 로그인이 가능합니다  
로그인한 사용자만 글과 댓글을 작성할 수 있습니다  

### 📝 글 작성 / 수정 / 삭제  
ToastUI Editor를 활용해 마크다운으로 글을 작성할 수 있습니다  
작성자는 자신의 글만 수정하거나 삭제할 수 있습니다  
관리자 계정은 전체 글을 수정하거나 삭제할 수 있습니다  

### 🔍 글 목록 / 검색  
비로그인 상태에서도 전체 글 목록을 열람할 수 있습니다  
제목을 기준으로 실시간 검색이 가능합니다  

### 💬 댓글 기능  
로그인한 사용자는 글에 댓글을 작성할 수 있습니다  
댓글은 게시글 하단에 입력할 수 있으며 실시간으로 반영됩니다  

### 🙋‍♀️ 프로필 수정  
닉네임, 블로그 이름, 프로필 이미지를 수정할 수 있습니다  
전역 상태(Zustand)로 관리하며, 모달 기반 UI로 처리됩니다  

### 🌓 다크모드  
다크모드 설정은 localStorage에 저장되며, 페이지 이동이나 새로고침 후에도 유지됩니다  
Zustand로 전역 상태를 관리합니다  

### 🛠 관리자 기능  
관리자는 모든 게시글에 대해 수정과 삭제가 가능합니다  

<br>

## 🧪 테스트 계정

| 역할 | 이메일 | 비밀번호 |
|------|--------|-----------|
| 관리자 | adminplanet@gmail.com | admin1234! |
| 일반 사용자 | mangochu@gmail.com | pass1234! |

<br>

## 실행 방법

### 1. 환경 변수 설정 (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_URL=https://your-api-url.com
NEXT_PUBLIC_STORAGE_BUCKET=your-storage-bucket-name
```

### 2. 의존성 설치

```bash
npm install --legacy-peer-deps
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. Supabase 콘솔 설정  
(테이블, 스토리지, 정책 등은 콘솔에서 직접 설정)

</div>

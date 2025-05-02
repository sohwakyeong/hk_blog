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
Supabase Auth를 사용해 이메일 기반 회원가입 및 로그인 기능을 구현했습니다.  
로그인한 사용자에 한해 글 작성과 댓글 작성이 가능합니다. 

### 📝 글 작성 / 수정 / 삭제  
ToastUI Editor를 활용해 마크다운으로 글을 작성할 수 있습니다.  
작성자는 자신의 글만 수정하거나 삭제할 수 있으며,  
관리자 계정은 전체 글에 대한 수정과 삭제가 가능합니다.  

### 🔍 글 목록 / 검색  
비로그인 상태에서도 전체 글 목록을 자유롭게 열람할 수 있습니다.  
또한, 제목을 기준으로 실시간 검색이 가능합니다.  

### 💬 댓글 기능  
로그인한 사용자는 각 게시글 하단에서 댓글을 작성할 수 있습니다.
댓글은 실시간으로 반영되어 사용자 간 소통이 원활합니다.  

### 🙋‍♀️ 프로필 수정  
닉네임, 블로그 이름, 프로필 이미지는  
모달 기반의 UI를 통해 손쉽게 수정할 수 있습니다.  
해당 정보는 Zustand를 이용한 전역 상태로 관리됩니다.  

### 🌓 다크모드  
다크모드 설정은 Zustand로 전역 상태를 관리하며,  
`localStorage`에 저장되어 페이지 이동이나 새로고침 이후에도 유지됩니다.  

### 🛠 관리자 기능  
관리자는 모든 게시글에 대해 수정 및 삭제 권한을 가집니다.  
이를 통해 전체 콘텐츠에 대한 통제가 가능하며, 사용자 관리에도 유용합니다.

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

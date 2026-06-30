# The Zen Pebble

> 디지털 인내심 테스트 — 마우스와 키보드에서 손을 떼고 가장 오래 버티는 사람이 승리합니다.

**배포 링크:** [zen-pebble.vercel.app](https://zen-pebble.vercel.app)

시간이 지날수록 조약돌 주변의 환경이 변화합니다. 당신은 얼마나 버틸 수 있나요?

## 기능

- **8단계 환경 진화** — 새벽 → 아침 → 낮 → 오후 → 황혼 → 밤 → 깊은 밤 → 새벽 복귀
- **1시간 윤회 시스템** — 48시간에서 압축하여 빠르게 변화 감지 가능
- **날씨 시스템** — 맑음 / 구름 / 안개 / 비 / 눈, 각각 다른 입자 효과
- **계절 변화** — 봄 / 여름 / 가을 / 겨울, 하늘과 땅의 색조 변화
- **풍경 배경** — 먼 산 3레이어 실루엣, 시간대/계절 색조 반영
- **천체 객체** — 태양(글로우), 달(글로우), 별 1200개 (밤에만 출현)
- **절차적 흙 텍스처** — FBM noise 기반으로 생성한 타일링 텍스처
- **성장하는 풀** — 1800개의 InstancedMesh 풀잎이 8분에 걸쳐 서서히 자라남
- **모바일 대응** — 터치 / 자이로 센서 감지
- **3D 조약돌** — Procedural noise로 생성한 유기적 형태

## 기술 스택

- **Frontend:** React 18 + TypeScript + Three.js (React Three Fiber / Drei)
- **State:** Zustand
- **Build:** Vite 6
- **Deploy:** Vercel + PostgreSQL

## 실행

```bash
npm install
npm run dev
```

![HowToEat](https://github.com/user-attachments/assets/c2d23162-8969-4ce6-b3ea-64f9f0c6a25a)
```
하잇 (How To Eat) 식단관리를 15만개 이상의 음식 데이터로 간편하게
```
<br>

## 🍎 팀 노션
[How To Eat](https://playful-goose-f90.notion.site/How-to-eat-17db5be7fe3d804c96a7d4db6847f1da?pvs=4)

<br>

## 💁🏻‍♂️ 팀 멤버

|[<img src="https://github.com/YeahyunKim.png" width="100px">](https://github.com/YeahyunKim)|[<img src="https://github.com/jay1261.png" width="100px">](https://github.com/jay1261)|
|:----:|:----:|
|[김예현](https://github.com/MK827)|[이동재](https://github.com/jay1261)|
|[Blog](https://maltyy.tistory.com/)|[Blog](https://jay1261.github.io/)|

<br>

## 🍎 프로젝트 목표

이번 하잇(식단 관리 서비스) 프로젝트를 진행하게 된 이유는, 실제 사용자 데이터를 기반으로 한 시스템을 스스로 기획하고 설계해보며 백엔드 개발자로서 전반적인 서비스 구조를 직접 설계하고 구축하는 경험을 쌓기 위함이었습니다.

**`사용자별 날짜/시간 단위 식단 기록 및 집계 기능`**<br>
유저의 식사 데이터를 daily_summary 테이블에 정규화된 형태로 저장하고, 아침·점심·저녁 단위로 누적 섭취량을 계산하는 기능을 구현했습니다. 이를 통해 시간 단위 데이터 집계 구조와 효율적인 테이블 설계 방식을 학습했습니다.

**`부족한 영양소 기반 음식 추천 알고리즘 설계`**<br>
섭취량과 목표 대비 비율을 계산하여 부족한 식사 시간대와 영양소를 자동 판단하고, 점수 기반으로 음식 추천이 이루어지도록 설계했습니다. 데이터 흐름과 추천 로직 전반을 직접 설계하며 비즈니스 로직의 정합성과 확장성을 고려한 구현 경험을 쌓았습니다.

**`SPA 구조 및 RESTful API 설계`**<br>
pushState를 활용한 SPA 구조를 기반으로, 페이지 새로고침 없이 데이터가 갱신되는 사용자 경험을 구현했습니다. RESTful한 URL과 DTO 기반 요청 처리로 API 일관성을 유지하며 프론트엔드와의 효율적인 통신 구조를 설계했습니다.

**`데이터 기반 UX 최적화 및 실사용자 피드백 반영`**<br>
헬스장 사용자 입장에서 반복되는 음식 등록과 기록이 번거롭다는 점을 해결하기 위해 즐겨찾기 기반 간편 등록 기능을 구현하고, 기록 시 실시간 탄단지 변화량 시각화를 통해 예측 가능한 사용자 경험을 설계했습니다.<br>
<br>
이 프로젝트를 통해 단순 기능 구현을 넘어, **“어떻게 하면 사용자에게 부담 없이 식단 기록을 유도할 수 있을까?”**를 중심으로 고민하며 데이터 설계, 추천 로직, API 응답 처리 등 다양한 측면에서 백엔드 역량을 심화할 수 있었습니다.

<br>

## 🏗 ERD
![ERD](https://github.com/user-attachments/assets/2e6b4522-c8e4-4a30-9e2e-787961a6e4cf)

<br>

## 🔥 개발 환경

### Backend

- Java  17
- SpringBoot  3.27.x
- MySQL  8.0.x
- Redis 7.4.0

### Infra

- EC2
- Route53
- Docker  27.1.1
- Docker Compose  2.29.1
- Github Action
- NGINX  (WAS, SSL, Reverse Proxy)

### Frontend

- Vanila JS
- node.js 22.4.x
- npm 10.8.x

<br>

## 🍀 주요 기술
### 추후 작성

<br>

## 🗣️ 기술적 의사결정

<!-- ====================== 분산 락, 낙관적 락 ====================== -->
### 추후 작성







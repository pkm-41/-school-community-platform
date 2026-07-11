export type BoardId = "all" | "free" | "study" | "lost" | "secret"

export type Post = {
  id: number
  board: Exclude<BoardId, "all">
  tag: "공지" | "자유" | "공부" | "분실물" | "비밀"
  anonymous: boolean
  notice?: boolean
  hot?: boolean
  op?: boolean
  title: string
  preview: string
  likes: number
  comments: number
  views: number
  time: string
  createdAt: number
}

export const boards: { id: BoardId; label: string; icon: string }[] = [
  { id: "all", label: "전체글", icon: "LayoutList" },
  { id: "free", label: "자유게시판", icon: "MessageCircle" },
  { id: "study", label: "공부/질문", icon: "BookOpen" },
  { id: "lost", label: "분실물 찾기", icon: "Search" },
  { id: "secret", label: "비밀게시판", icon: "Lock" },
]

export const lifeMenu: { label: string; icon: string; badge?: number }[] = [
  { label: "쪽지", icon: "Mail" },
  { label: "스터디 모집", icon: "Users" },
  { label: "시간표 / D-day", icon: "Calendar" },
  { label: "급식 / 건의", icon: "UtensilsCrossed" },
  { label: "알림", icon: "Bell", badge: 5 },
  { label: "내 프로필", icon: "User" },
]

export const initialPosts: Post[] = [
  {
    id: 1,
    board: "free",
    tag: "공지",
    anonymous: false,
    notice: true,
    op: true,
    title: "[공지] 스쿨타임 이용 수칙 안내",
    preview: "개인정보 공개 금지, 비하/욕설/혐오 표현 제재 안내",
    likes: 24,
    comments: 1,
    views: 412,
    time: "2시간 전",
    createdAt: Date.now() - 1000 * 60 * 120,
  },
  {
    id: 2,
    board: "free",
    tag: "자유",
    anonymous: true,
    hot: true,
    title: "기말고사 D-20 다들 어디까지 공부함??",
    preview: "나만 아직 시작도 못함..? 수학이 너무 어렵다ㅠㅠ 혹시 효율적인 공부법 아는 사람 있어?",
    likes: 47,
    comments: 3,
    views: 203,
    time: "10분 전",
    createdAt: Date.now() - 1000 * 60 * 10,
  },
  {
    id: 3,
    board: "study",
    tag: "공부",
    anonymous: true,
    hot: true,
    title: "3학년 수학 기출 공유합니다 (2020-2025)",
    preview: "공부하면서 모은 기출문제 파일 공유해요. 문과/이과 구분해서 정리했어요!",
    likes: 156,
    comments: 2,
    views: 892,
    time: "1시간 전",
    createdAt: Date.now() - 1000 * 60 * 60,
  },
  {
    id: 4,
    board: "free",
    tag: "자유",
    anonymous: true,
    hot: true,
    title: "오늘 짜장밥 진짜 역대급이었다 ㄹㅇ",
    preview: "오늘 급식 너무 맛있었어요ㅠㅠ 조리사 선생님 최고",
    likes: 89,
    comments: 2,
    views: 445,
    time: "35분 전",
    createdAt: Date.now() - 1000 * 60 * 35,
  },
  {
    id: 5,
    board: "study",
    tag: "공부",
    anonymous: true,
    title: "미적분 극한 개념 이해가 안 가요 ㅠ",
    preview: "교과서 읽어봤는데 도저히 모르겠어요. 쉽게 설명해주실 분 계신가요?",
    likes: 12,
    comments: 5,
    views: 88,
    time: "22분 전",
    createdAt: Date.now() - 1000 * 60 * 22,
  },
  {
    id: 6,
    board: "study",
    tag: "공부",
    anonymous: true,
    title: "스터디 같이 할 사람 구해요 (수학/영어)",
    preview: "도서관에서 주말마다 하려고요. 성실한 분 환영!",
    likes: 31,
    comments: 8,
    views: 174,
    time: "1시간 전",
    createdAt: Date.now() - 1000 * 60 * 58,
  },
  {
    id: 7,
    board: "lost",
    tag: "분실물",
    anonymous: true,
    title: "3층 복도에서 검정 에어팟 케이스 주웠어요",
    preview: "오늘 점심시간에 주웠습니다. 잃어버리신 분 댓글 주세요!",
    likes: 8,
    comments: 4,
    views: 56,
    time: "40분 전",
    createdAt: Date.now() - 1000 * 60 * 40,
  },
  {
    id: 8,
    board: "secret",
    tag: "비밀",
    anonymous: true,
    title: "요즘 진로 때문에 너무 막막한데 나만 그런가",
    preview: "다들 목표가 뚜렷한 것 같은데 나만 길을 못 찾은 느낌이라 불안해요...",
    likes: 64,
    comments: 12,
    views: 301,
    time: "3시간 전",
    createdAt: Date.now() - 1000 * 60 * 180,
  },
]

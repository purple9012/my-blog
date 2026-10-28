window.MATH_UNITS.push({
  id: "unit-02",
  order: 2,
  title: "벡터와 행렬",
  summary: "데이터=벡터, 신경망 한 층 = $Wx+b$, 코사인 유사도",
  sections: [
    {
      heading: "벡터: 숫자를 묶은 것",
      body: "<p>벡터는 숫자 여러 개를 순서대로 묶은 것입니다. 예를 들어 $a=(1,2)$ 는 \"오른쪽으로 1, 위로 2\"만큼 가는 화살표로 생각할 수 있습니다.</p><p>두 가지 기본 연산이 있습니다.</p><ul><li>덧셈: 같은 자리끼리 더합니다. $a=(1,2)$, $b=(3,4)$ 이면 $a+b=(4,6)$ 입니다.</li><li>스칼라배: 모든 성분에 같은 수를 곱합니다. $2a=(2,4)$ 입니다.</li></ul><p>AI 연결: 컴퓨터는 모든 데이터를 숫자 묶음, 즉 벡터로 다룹니다. 키·몸무게 두 값은 2차원 벡터이고, 28×28 크기 흑백 이미지는 784차원 벡터입니다.</p>",
      example: {
        question: "<p>$a=(1,2)$, $b=(3,4)$ 일 때 $b-a$ 는?</p>",
        solution: "<p>같은 자리끼리 빼면 $(3-1,\\ 4-2)=(2,2)$ 입니다.</p>"
      }
    },
    {
      heading: "내적과 크기",
      body: "<p>내적은 같은 자리끼리 곱해서 모두 더한 값입니다.</p>$$a\\cdot b=\\sum_i a_i b_i = a_1b_1+a_2b_2+\\cdots$$<p>$a=(1,2)$, $b=(3,4)$ 이면 $a\\cdot b=1\\cdot3+2\\cdot4=3+8=11$ 입니다. 결과는 벡터가 아니라 숫자 하나입니다.</p><p>벡터의 크기(길이)는 자기 자신과의 내적의 제곱근입니다.</p>$$\\lVert a\\rVert=\\sqrt{a\\cdot a}=\\sqrt{a_1^2+a_2^2}$$<p>$a=(1,2)$ 이면 $\\lVert a\\rVert=\\sqrt{1+4}=\\sqrt5$ 입니다.</p><p>두 벡터의 내적이 0이면 서로 수직(직교)입니다. 예: $(1,0)\\cdot(0,1)=0$.</p>",
      example: {
        question: "<p>$u=(2,-1)$, $v=(1,2)$ 의 내적을 구하고 직교하는지 판단하세요.</p>",
        solution: "<p>$u\\cdot v=2\\cdot1+(-1)\\cdot2=2-2=0$ 이므로 직교합니다.</p>"
      }
    },
    {
      heading: "행렬과 행렬×벡터 곱",
      body: "<p>행렬은 숫자를 직사각형으로 배열한 것입니다. 행렬×벡터 곱은 행렬의 각 행과 벡터의 내적을 차례로 구한 결과입니다.</p>$$\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}\\begin{pmatrix}5\\\\6\\end{pmatrix}=\\begin{pmatrix}1\\cdot5+2\\cdot6\\\\3\\cdot5+4\\cdot6\\end{pmatrix}=\\begin{pmatrix}17\\\\39\\end{pmatrix}$$<p>첫째 행 $(1,2)$ 와 $(5,6)$ 의 내적이 17, 둘째 행 $(3,4)$ 와 $(5,6)$ 의 내적이 39입니다. 행렬은 벡터를 다른 벡터로 바꾸는 함수라고 볼 수 있습니다.</p>",
      example: {
        question: "<p>$\\begin{pmatrix}2&0\\\\1&1\\end{pmatrix}\\begin{pmatrix}3\\\\4\\end{pmatrix}$ 을 계산하세요.</p>",
        solution: "<p>첫째 행: $2\\cdot3+0\\cdot4=6$, 둘째 행: $1\\cdot3+1\\cdot4=7$. 결과는 $\\begin{pmatrix}6\\\\7\\end{pmatrix}$ 입니다.</p>"
      }
    },
    {
      heading: "AI 연결: 신경망 한 층과 코사인 유사도",
      body: "<p>신경망의 한 층은 행렬×벡터 곱에 상수 벡터를 더한 것입니다.</p>$$y=Wx+b$$<p>$x$ 는 입력 벡터, $W$ 는 가중치 행렬, $b$ 는 편향 벡터입니다. 예를 들어 $W=\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}$, $x=\\begin{pmatrix}5\\\\6\\end{pmatrix}$, $b=\\begin{pmatrix}1\\\\-1\\end{pmatrix}$ 이면 $Wx=\\begin{pmatrix}17\\\\39\\end{pmatrix}$ 이고 $y=\\begin{pmatrix}18\\\\38\\end{pmatrix}$ 입니다. 학습이란 데이터에 맞게 $W$ 와 $b$ 의 값을 조정하는 일입니다. 이 결과에 1단원의 시그모이드 같은 활성화 함수를 적용하면 한 층이 완성됩니다.</p><p>코사인 유사도는 두 벡터가 얼마나 같은 방향을 가리키는지 재는 값으로, 문장·이미지 임베딩 비교에 많이 씁니다.</p>$$\\cos\\theta=\\frac{a\\cdot b}{\\lVert a\\rVert\\,\\lVert b\\rVert}$$<p>같은 방향이면 1, 직교하면 0입니다. $(1,0)$ 과 $(0,1)$ 은 내적이 0이므로 코사인 유사도도 0입니다.</p>",
      example: {
        question: "<p>$a=(1,2)$, $c=(2,4)$ 의 코사인 유사도는?</p>",
        solution: "<p>$a\\cdot c=2+8=10$, $\\lVert a\\rVert=\\sqrt5$, $\\lVert c\\rVert=\\sqrt{20}=2\\sqrt5$ 이므로 $\\frac{10}{\\sqrt5\\cdot2\\sqrt5}=\\frac{10}{10}=1$ 입니다. 같은 방향이므로 1입니다.</p>"
      }
    }
  ],
  quiz: [
    {
      question: "<p>$a=(1,2)$, $b=(3,4)$ 일 때 $a+b$ 는?</p>",
      choices: ["$(3,8)$", "$(2,2)$", "$(4,6)$", "$(-2,-2)$"],
      answer: 2,
      explanation: "<p>같은 자리끼리 더하면 $(1+3,\\ 2+4)=(4,6)$ 입니다.</p>"
    },
    {
      question: "<p>$a=(1,2)$, $b=(3,4)$ 의 내적 $a\\cdot b$ 는?</p>",
      choices: ["$11$", "$10$", "$14$", "$24$"],
      answer: 0,
      explanation: "<p>$a\\cdot b=1\\cdot3+2\\cdot4=3+8=11$ 입니다.</p>"
    },
    {
      question: "<p>$a=(1,2)$ 의 크기 $\\lVert a\\rVert$ 는?</p>",
      choices: ["$3$", "$5$", "$\\sqrt3$", "$\\sqrt5$"],
      answer: 3,
      explanation: "<p>$\\lVert a\\rVert=\\sqrt{1^2+2^2}=\\sqrt5$ 입니다. 제곱근을 씌우는 것을 잊지 마세요.</p>"
    },
    {
      question: "<p>$\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}\\begin{pmatrix}5\\\\6\\end{pmatrix}$ 의 값은?</p>",
      choices: ["$\\begin{pmatrix}23\\\\34\\end{pmatrix}$", "$\\begin{pmatrix}17\\\\39\\end{pmatrix}$", "$\\begin{pmatrix}5\\\\24\\end{pmatrix}$", "$\\begin{pmatrix}11\\\\39\\end{pmatrix}$"],
      answer: 1,
      explanation: "<p>각 행과 $(5,6)$ 의 내적: $1\\cdot5+2\\cdot6=17$, $3\\cdot5+4\\cdot6=39$. 결과는 $\\begin{pmatrix}17\\\\39\\end{pmatrix}$ 입니다.</p>"
    },
    {
      question: "<p>다음 중 서로 직교(내적이 0)하는 벡터 쌍은?</p>",
      choices: ["$(1,2)$ 와 $(2,1)$", "$(1,1)$ 과 $(1,2)$", "$(2,3)$ 과 $(3,-2)$", "$(1,1)$ 과 $(2,2)$"],
      answer: 2,
      explanation: "<p>$(2,3)\\cdot(3,-2)=6-6=0$ 입니다. 나머지는 내적이 각각 $4$, $3$, $4$ 로 0이 아닙니다.</p>"
    }
  ]
});

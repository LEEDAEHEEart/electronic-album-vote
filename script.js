// 투표 데이터를 저장할 공간 (나중에 서버와 연동해서 여러 사람의 투표를 합산할 수 있지만, 지금은 여러분 컴퓨터에만 저장)
// 'albumVotes'라는 이름으로 로컬 스토리지에 저장된 데이터가 있으면 가져오고, 없으면 빈 객체를 만듭니다.
let votes = JSON.parse(localStorage.getItem('albumVotes')) || {};

// ---------------------- 투표 결과 업데이트 함수 ----------------------
// 특정 페이지의 투표 결과를 화면에 표시하는 함수
function updateVoteDisplay(pageId) {
    // 해당 페이지의 투표 결과가 표시될 요소를 찾습니다. (예: <p id="result-page1">)
    const resultElement = document.getElementById(`result-${pageId}`);
    if (resultElement) {
        // 해당 페이지의 투표 데이터가 있으면 가져오고, 없으면 빈 객체로 시작합니다.
        const pageVotes = votes[pageId] || {};
        let resultText = "현재 투표 결과: ";
        let hasVotes = false; // 투표 데이터가 있는지 확인하는 플래그

        // pageVotes 객체 안의 각 투표 옵션(예: 좋아요, 별로예요)과 투표 수를 반복하여 resultText에 추가합니다.
        for (const option in pageVotes) {
            resultText += `${option}: ${pageVotes[option]}표, `;
            hasVotes = true;
        }

        if (hasVotes) {
            // 마지막 쉼표와 공백을 제거하고 결과 텍스트를 업데이트합니다.
            resultElement.textContent = resultText.slice(0, -2);
        } else {
            // 투표가 없으면 기본 메시지를 표시합니다.
            resultElement.textContent = "아직 투표가 없습니다.";
        }
    }
}

// ---------------------- 초기화: 모든 페이지의 투표 결과 업데이트 ----------------------
// 웹 페이지가 로드될 때 모든 앨범 페이지의 투표 결과를 업데이트하여 보여줍니다.
document.querySelectorAll('.page').forEach(page => {
    updateVoteDisplay(page.id);
});

// ---------------------- 투표 버튼 클릭 이벤트 처리 ----------------------
// 모든 'vote-button' 클래스를 가진 버튼을 찾아서 클릭 이벤트를 추가합니다.
document.querySelectorAll('.vote-button').forEach(button => {
    button.addEventListener('click', function() {
        // 클릭된 버튼의 'data-page' 속성에서 페이지 ID를 가져옵니다. (예: "1")
        const pageId = `page${this.dataset.page}`; // "page1", "page2" 형태로 만듭니다.
        // 클릭된 버튼의 'data-option' 속성에서 투표 옵션을 가져옵니다. (예: "좋아요")
        const option = this.dataset.option;

        // 해당 페이지에 대한 투표 데이터가 없으면 새로 만듭니다.
        if (!votes[pageId]) {
            votes[pageId] = {};
        }
        // 해당 옵션에 대한 투표 수가 없으면 0으로 시작합니다.
        if (!votes[pageId][option]) {
            votes[pageId][option] = 0;
        }

        // 해당 옵션의 투표 수를 1 증가시킵니다.
        votes[pageId][option]++;

        // 변경된 투표 데이터를 웹 브라우저의 로컬 스토리지에 저장합니다.
        // JSON.stringify는 JavaScript 객체를 문자열로 바꿔주는 역할을 합니다. (저장할 때 필요)
        localStorage.setItem('albumVotes', JSON.stringify(votes));

        alert(`"${option}"에 투표하셨습니다!`); // 사용자에게 알림 메시지 표시
        updateVoteDisplay(pageId); // 현재 페이지의 투표 결과를 업데이트하여 보여줍니다.
    });
});

// ---------------------- 페이지 넘김 버튼 클릭 이벤트 처리 ----------------------
// 모든 'nav-button' 클래스를 가진 버튼(다음, 이전)을 찾아서 클릭 이벤트를 추가합니다.
document.querySelectorAll('.nav-button').forEach(button => {
    button.addEventListener('click', function() {
        // 현재 화면에 보이는 페이지를 찾습니다.
        const currentPage = document.querySelector('.page.active');
        // 클릭된 버튼의 'data-target' 속성에서 이동할 페이지의 ID를 가져옵니다. (예: "page2")
        const targetPageId = this.dataset.target;
        // 이동할 페이지 요소를 찾습니다.
        const targetPage = document.getElementById(targetPageId);

        if (currentPage && targetPage) {
            // 현재 페이지에서 'active' 클래스를 제거하여 숨깁니다.
            currentPage.classList.remove('active');
            // 이동할 페이지에 'active' 클래스를 추가하여 보이게 합니다.
            targetPage.classList.add('active');

            // 새로운 페이지로 넘어갔으니 해당 페이지의 투표 결과도 업데이트합니다.
            updateVoteDisplay(targetPageId);
        }
    });
});
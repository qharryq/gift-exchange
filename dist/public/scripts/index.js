/******************************************************************************
 *                          Fetch and display members
 ******************************************************************************/

displayMembers();


function displayMembers() {
    httpGet('/api/members/all')
        .then(response => response.json())
        .then((response) => {
            var allMembers = response.members;
            // Empty the anchor
            var allMembersAnchor = document.getElementById('all-members-anchor');
            allMembersAnchor.innerHTML = '';
            // Append members to anchor
            allMembers.forEach((member) => {
                allMembersAnchor.innerHTML += getMemberDisplayEle(member);
            });
        });
};


function getMemberDisplayEle(member) {
    return `<div class="member-display-ele">

        <div class="normal-view">
            <div>Name: ${member.name}</div>
            <div>Email: ${member.email}</div>
            <button class="edit-member-btn" data-member-id="${member.id}">
                Edit
            </button>
            <button class="delete-member-btn" data-member-id="${member.id}">
                Delete
            </button>
        </div>
        
        <div class="edit-view">
            <div>
                Name: <input class="name-edit-input" value="${member.name}">
            </div>
            <div>
                Email: <input class="email-edit-input" value="${member.email}">
            </div>
            <button class="submit-edit-btn" data-member-id="${member.id}">
                Submit
            </button>
            <button class="cancel-edit-btn" data-member-id="${member.id}">
                Cancel
            </button>
        </div>
    </div>`;
}


/******************************************************************************
 *                        Add, Edit, and Delete Members
 ******************************************************************************/

document.addEventListener('click', function (event) {
    event.preventDefault();
    var ele = event.target;
    if (ele.matches('#add-member-btn')) {
        addMember();
    } else if (ele.matches('.edit-member-btn')) {
        showEditView(ele.parentNode.parentNode);
    } else if (ele.matches('.cancel-edit-btn')) {
        cancelEdit(ele.parentNode.parentNode);
    } else if (ele.matches('.submit-edit-btn')) {
        submitEdit(ele);
    } else if (ele.matches('.delete-member-btn')) {
        deleteMember(ele);
    }
}, false)


function addMember() {
    var nameInput = document.getElementById('name-input');
    var emailInput = document.getElementById('email-input');
    var data = {
        member: {
            name: nameInput.value,
            email: emailInput.value
        },
    };
    httpPost('/api/members/add', data)
        .then(() => {
            displayMembers();
        })
}


function showEditView(memberEle) {
    var normalView = memberEle.getElementsByClassName('normal-view')[0];
    var editView = memberEle.getElementsByClassName('edit-view')[0];
    normalView.style.display = 'none';
    editView.style.display = 'block';
}


function cancelEdit(memberEle) {
    var normalView = memberEle.getElementsByClassName('normal-view')[0];
    var editView = memberEle.getElementsByClassName('edit-view')[0];
    normalView.style.display = 'block';
    editView.style.display = 'none';
}


function submitEdit(ele) {
    var memberEle = ele.parentNode.parentNode;
    var nameInput = memberEle.getElementsByClassName('name-edit-input')[0];
    var emailInput = memberEle.getElementsByClassName('email-edit-input')[0];
    var id = ele.getAttribute('data-member-id');
    var data = {
        member: {
            name: nameInput.value,
            email: emailInput.value,
            id: id
        }
    };
	httpPut('/api/members/update', data)
        .then(() => {
            displayMembers();
        })
}


function deleteMember(ele) {
    var id = ele.getAttribute('data-member-id');
	httpDelete('/api/members/delete/' + id)
        .then(() => {
            displayMembers();
        })
}


function httpGet(path) {
    return fetch(path, getOptions('GET'))
}


function httpPost(path, data) {
    return fetch(path, getOptions('POST', data));
}


function httpPut(path, data) {
    return fetch(path, getOptions('PUT', data));
}


function httpDelete(path) {
    return fetch(path, getOptions('DELETE'));
}


function getOptions(verb, data) {
    var options = {
        dataType: 'json',
        method: verb,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    if (data) {
        options.body = JSON.stringify(data);
    }
    return options;
}


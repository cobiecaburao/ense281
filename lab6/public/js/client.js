/*
Cobie Caburao
200436566
ENSE 281
Lab 6
*/
let currentUser = "User A";
let notes = [];

$(document).ready( () => {
    $( ".dropdown-item" ).on( "click", function() {
        const selectedUser = $(this).text();

        currentUser = selectedUser;

        $( "#username-header" ).html(`
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16">
                <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
            </svg>
            Logged in as ${currentUser}
        `)

        updateNotes();
    })

    $( "#note-list" ).on( "click", "#new-note-btn", function() {
        addNote();
    });

    $( "#note-list" ).on( "click", ".upvote", function() {
        voting($(this).parent().data('id'), 'up');
    });

    $( "#note-list" ).on( "click", ".downvote", function() {
        voting($(this).parent().data('id'), 'down');
    });

    updateNotes();
});

function addNote() {
    const noteInput = document.getElementById('new-note-input');

    // makes sure inputs are not empty
    if(noteInput.value === "") {
        alert("incomplete note!");
        return;
    }

    const newNote = {id: Date.now()+Math.random(),
                     author: currentUser,
                     message: noteInput.value,
                     upvotes: [],
                     downvotes: []};

    notes.push(newNote);

    // empty input objects
    noteInput.value = "";

    updateNotes();
}

function voting(noteID, voteType) {
    const note = notes.find(
        function(n) {
            if (String(n.id) === String(noteID)) {
                return true;
            } else {
                return false;
            }
        }
    );

    if (!note || note.author === currentUser) {
        return;
    }

    const hasUpvoted = note.upvotes.includes(currentUser);
    const hasDownvoted = note.downvotes.includes(currentUser);

    note.upvotes = note.upvotes.filter(
        function (u) {
            if (u !== currentUser) {
                return true
            } else {
                return false
            }
        }
    );

    note.downvotes = note.downvotes.filter(
        function (u) {
            if (u !== currentUser) {
                return true
            } else {
                return false
            }
        }
    );

    if (voteType === 'up') {
        if (!hasUpvoted) {
            note.upvotes.push(currentUser);
        }
    } else {
        if (!hasDownvoted) {
                note.downvotes.push(currentUser);
        }
    }

    updateNotes();
}

function updateNotes() {
    const $list = $('#note-list').empty();

    notes.forEach(note => {
        const isAuthor = note.author === currentUser;
        const hasUpvoted = note.upvotes.includes(currentUser);
        const hasDownvoted = note.downvotes.includes(currentUser);
        
        const score = note.upvotes.length - note.downvotes.length;

        let displayScore = "";

        if (isAuthor || hasUpvoted || hasDownvoted) {
            displayScore = `<span class="input-group-text">${score}</span>`
        }

        const $note = $(`
            <div data-id="${note.id}" class="note input-group mb-3">
                <span class="input-group-text form-control">
                    ${note.message}
                </span>
            </div>
        `)

        const $upvoteBtn = $(`
            <button type="button" class="upvote btn btn-outline-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"/>
                </svg>
            </button>  
        `)

        if (hasUpvoted) {
            $upvoteBtn.addClass("btn-success");
            $upvoteBtn.removeClass("btn-outline-secondary");
        }

        const $downvoteBtn = $(`
            <button type="button" class="downvote btn btn-outline-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"/>
                </svg>
            </button>    
        `)

        if (hasDownvoted) {
            $downvoteBtn.addClass("btn-danger");
            $downvoteBtn.removeClass("btn-outline-secondary");
        }

        if (isAuthor) {
            $upvoteBtn.prop('hidden', true);
            $downvoteBtn.prop('hidden', true);
        }

        $note.append($upvoteBtn, $downvoteBtn, displayScore);

        $list.append($note);
    });

    $list.append(`
        <div id="new-note" class="input-group mb-3">
            <input id="new-note-input" type="text" class="form-control" placeholder="Enter a new note here">
            <button id="new-note-btn" type="button" class="btn btn-primary">Add</button>
        </div>
    `);
}

import { useEffect, useState } from "react";
import "./bug.css";

function BugComments({ bugId }) {

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const [editingId, setEditingId] = useState(null);
const [editText, setEditText] = useState("");

const [replyTo, setReplyTo] = useState(null);
const [replyText, setReplyText] = useState("");

const token = localStorage.getItem("token");

const payload = token
  ? JSON.parse(atob(token.split(".")[1]))
  : null;

const userId = payload?.id;



 const loadComments = async () => {

  const res = await fetch(
    `http://localhost:5000/api/bugs/${bugId}/comments`
  );

  const data = await res.json();
  setComments(data);
};

useEffect(() => {
  loadComments();
}, [bugId]);

  const postComment = async (parentId = null) => {

    if (!text.trim()) return;

    await fetch(
      `http://localhost:5000/api/bugs/${bugId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          content: text,
          parentId
        })
      }
    );

    setText("");
    loadComments();
  };

  const postReply = async (parentId) => {

  if (!replyText.trim()) return;

  await fetch(
    `http://localhost:5000/api/bugs/${bugId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        content: replyText,
        parentId
      })
    }
  );

  setReplyText("");
  setReplyTo(null);
  loadComments();
};

  return (
    <div className="comments-box">

      <h3>Comments</h3>

      <textarea
        placeholder="Write a comment... Use @username"
        value={text}
        onChange={e => setText(e.target.value)}
      />

      <button onClick={() => postComment()}>
        Add Comment
      </button>

      {comments.map(c => {

  const isAuthor = c.authorId === userId;

  const canEdit =
    isAuthor &&
    Date.now() - new Date(c.createdAt).getTime() <
      5 * 60 * 1000;

  return (
    <div key={c.id} className="comment">

      <div className="comment-header">
        <strong>{c.author?.name}</strong>
        <span>
          {new Date(c.createdAt).toLocaleString()}
        </span>
      </div>

      {/* EDIT MODE */}
      {editingId === c.id ? (
        <>
          <textarea
            value={editText}
            onChange={e => setEditText(e.target.value)}
          />

          <button
            onClick={async () => {
              await fetch(
                `http://localhost:5000/api/comments/${c.id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                  },
                  body: JSON.stringify({
                    content: editText
                  })
                }
              );

              setEditingId(null);
              loadComments();
            }}
          >
            Save
          </button>

          <button onClick={() => setEditingId(null)}>
            Cancel
          </button>
        </>
      ) : (
        <p>{c.content}</p>
      )}

      {/* ACTION BUTTONS */}

<div className="comment-actions">

  {/* EDIT / DELETE — Author only */}
  {canEdit && editingId !== c.id && (
    <>
      <button
        onClick={() => {
          setEditingId(c.id);
          setEditText(c.content);
        }}
      >
        Edit
      </button>

      <button
        onClick={async () => {

          if (!window.confirm("Delete this comment?"))
            return;

          await fetch(
            `http://localhost:5000/api/comments/${c.id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: "Bearer " + token
              }
            }
          );

          loadComments();
        }}
      >
        Delete
      </button>
    </>
  )}

  {/* ⭐ REPLY — visible to ALL */}
  <button
    className="reply-btn"
    onClick={() => setReplyTo(c.id)}
  >
    Reply
  </button>

</div>

{/* REPLY BOX */}

{replyTo === c.id && (
  <div className="reply-box">

    <textarea
      placeholder="Write a reply..."
      value={replyText}
      onChange={e => setReplyText(e.target.value)}
      autoFocus
    />

    <div className="reply-actions">
      <button onClick={() => postReply(c.id)}>
        Submit Reply
      </button>

      <button
        className="cancel-btn"
        onClick={() => setReplyTo(null)}
      >
        Cancel
      </button>
    </div>

  </div>
)}

       

     
      {/* REPLIES */}

{c.replies.map(r => (

  <div key={r.id} className="reply">

    <div className="comment-header">
      <strong>{r.author?.name}</strong>
      <span>
        {new Date(r.createdAt).toLocaleString()}
      </span>
    </div>

    <p>{r.content}</p>

  </div>

))}

    </div>
  );
})}

    </div>
  );
}

export default BugComments;
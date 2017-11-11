Route details for http calls
======
- [DB Entities](#db-entities)
    - [User](#user)
        - [Sign Up](#sign-up)
        - [Sign in](#sign-in)
    - [Thread](#thread)
        - [Get Threads](#get-threads)
        - [Add Thread](#add-thread)
    - [Reply](#reply)
        - [Get Replies](#get-replies)
        - [Add Reply](#add-reply)
## DB Entities
---
*Method: POST*

### User
#### Sign Up
+ Method: AJAX or Full http call (will be decided later)
+ Post JSON object to `[base URL]/util/addUser`
+ Example JSON data (All fields are compulsory)
```javascript
{
    "userName": "username",
    "name": "User's full name",
    "email": "User email",
    "password": "Hash of the user password",
    "social": ["Social Media profile links array"],
    "interests": ["Interest array of the user"],
    "profile_type": "Moderator/Normal"
}
```
+ Reply: `{
    status: success/ failure,
    userName: username
}` <br />
*Reply subject to change

#### Sign in
+ Method: AJAX
+ Post JSON object to `[base URL]/users/login`
+ Example JSON: `{"userName": "username", "password": "password or password_hash"}` 
+ Reply: `{
    "userName": "username",
    "rating": "1-5 stars",
    "profile_type": "Moderator/Normal"
}`

---

### Thread

#### Get Threads
+ Method: AJAX
+ GET call to `[base URL]/threads/{category}`
+ Example JSON Result `{"threads": [] //Array of results}`
+ Each Thread object has the following structure
```javascript
{
    threadID: "Thread ID",
    title: "Title of the Thread",
    desc: "Description",
    userName: "Author's username",
    replieIDs: [],
    numViews: Number,
    rating: rating,
    reports: Number
}
```
#### Add Thread
+ Method: AJAX
+ Post JSON object to `[base URL]/util/addThread`
+ Example JSON data (All fields are compulsory)
```javascript
{
    "title": "Thread title",
    "desc": "Thread description",
    "category": "Category the thread belongs to"
    "userName": "Author's username",
}
```
+ Reply: `{
    status: success/ failure,
    title: title
}` <br />
*Reply subject to change

---

### Reply

#### Get Replies
+ Method: AJAX
+ GET call to `[base URL]/replies/{type: thread/ reply}/{id: threadID/ ReplyID}`
+ Example Reply
`
{
    "type": "thread/reply",
    "replies": [], // Array of replies
}
`
+ Replies array consists of Reply objects 
```javascript
{
    "ReplyID": "reply id",
    "text": "text content",
    "author": "author of reply",
    "rating": "1-5 stars"
}
```

#### Add Reply
+ Method: AJAX
+ Post JSON object to `[base URL]/util/addReply`
+ Example JSON data (All fields are compulsory)
```javascript
{
    "replyToID": "ID of post this is a reply to or '0' if reply to main Thread",
    "userName": "Author's username",
    "text": "Text content of Reply"
}
```
+ Reply: `{
    status: success/ failure,
    threadID: threadID
}` <br />
*Reply subject to change

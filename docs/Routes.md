Route details for http calls
======
- [DB Entities](#db-entities)
    - [User](#user)
    - [Thread](#thread)
    - [Reply](#reply)
## DB Entities
---
*Method: POST*

### User
+ Method: AJAX or Full http call (will be decided later)
+ Post JSON object to `[base URL]/util/addUser`
+ Example JSON data (All fields are compulsory)
```javascript
{
    "userName": "username",
    "name": "User's full name",
    "email": "User email",
    "password_hash": "Hash of the user password",
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

---

### Thread
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
+ Method: AJAX
+ Post JSON object to `[base URL]/util/addReply`
+ Example JSON data (All fields are compulsory)
```javascript
{
    "replyToID": "ID of post this is a reply to or '0' if reply to main Thread",
    "userName": "Author's username",
}
```
+ Reply: `{
    status: success/ failure,
    threadID: threadID
}` <br />
*Reply subject to change

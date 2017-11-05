# Schemas for DB entities 

## User
#### User provided
	Name
	E-Mail
	User Name
	Password
	Status: Moderator or Regular
	Social Network links
		FB
		Twitter
		Any other
	Interests: Keywords (can be multiple)
#### Auto-generated	
	Date Join
	Stars: Range 1-5
	Number of threads:
	Number of posts:
	Number of replies:
	Bookmarks:{Thread ID}
	StarsToPost = [PostID, Stars]

---

## Thread
	ID
	Thread: Title
	Description
	Category
	Number of replies
	Avg: Number of stars
	Posted By: User ID
	Number of Reports
	Reply IDs [] : Independent

---

## Reply
	ID
	ThreadID
	Replied to
	RepliesIds = [] : Dependent
	Avg Stars
	Reply By (User ID)
	Report Reply

---

## Categories:
	ID:
	Title:
	Thread IDs
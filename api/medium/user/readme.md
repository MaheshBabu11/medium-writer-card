## Medium-Writers-Card

This is a simple card that can be embedded in your website/github profile to show your status such as number of followers, following etc. on Medium.

This is a serverless function that loads the medium user profile page and scrapes the required information from the page. The information is then displayed in the card.

### Usage

```
<img src="https://medium-writer-card.vercel.app/api/medium/user/index?name=<your-medium-username>" alt="medium user card">
```
where `<your-medium-username>` is your medium username. On clicking the card, it will redirect to your medium profile.

### Example

```
<a target="_blank" href="https://medium.com/@mahesh.babu11"><img src="https://medium-writer-card.vercel.app/api/medium/user/index?name=mahesh.babu11" alt="medium user card">
```

### Output

<a target="_blank" href="https://medium.com/@mahesh.babu11"><img src="https://medium-writer-card.vercel.app/api/medium/user/index?name=mahesh.babu11" alt="medium user card">
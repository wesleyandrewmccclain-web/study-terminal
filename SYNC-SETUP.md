# Sync your progress between devices

Open **⇅ Sync devices** in the sidebar, or tap the **⇅** button at the top. There are three ways to sync. You can use one or combine them.

## Option 1: Your account (automatic, recommended)

Cloud sync is already set up in this copy of the game. Play at **https://wesleyandrewmccclain-web.github.io/study-terminal/** on any laptop or phone.

1. Open **⇅ Sync devices** → **Log in to sync everywhere**.
2. First time: type a username and a PIN or password (6+ characters) → **Create account**. Your progress uploads.
3. Every other device: the same username and PIN → **Log in**. Progress from that device merges in; nothing is lost.
4. It keeps syncing by itself while you're online. It also works offline and catches up later.

**What an account adds:**
- **Online leaderboard**: everyone with an account, on the Leaderboard page.
- **Today's results**: everyone's daily-challenge score, on the Daily page.
- **Live duels anywhere**: create a duel, send the 6-letter code, and you'll see each other's progress live.

**Your friend** creates their own account on their own device. Progress never mixes between accounts.

**Privacy:** under **Sync devices** you can tick **Hide me from the online leaderboard** (your name, scores and daily results disappear for everyone else), or **Delete my account** (asks for your PIN, then removes the account, its scores, duels and the cloud copy; progress saved on each device stays).

**Forgot your PIN?** It can't be recovered (it's stored hashed). Make a new account. After 8 wrong tries an account locks for 15 minutes.

**Behind the scenes:** a free Supabase database (project `bqjxvzjvaecnauhirvud`, set up with `sync-setup.sql`). The key in `sync-config.js` is safe to share. It can only call the game's functions. It can't list, read or delete anyone's data directly.

**Advanced (no username):** under Cloud sync you can still make a bare sync key and pair devices with a QR code.

## Option 2: Claude account sync (automatic, Wesley only)

Open your **private** Claude link for the game while signed in to Claude. Progress saves to your Claude account, so it's the same on every device where you open that link. There's nothing to set up. Your friend keeps using the public link, which doesn't have this.

## Option 3: Transfer code (no account at all)

**Sync devices → Make transfer code** on one device, then paste it under **Receive** on the other (or **Save as file** and open the file there). Copying on a Mac and pasting on an iPhone works through Apple's Universal Clipboard. Small codes also show a QR you can scan with the game's **Scan QR** button.

## How merging works

Nothing gets overwritten. When two devices sync:
- answers, accuracy, XP and today's goal **add up** the new work from both sides
- each question's review schedule keeps the **most recent** answer
- missed-question lists combine (a question you fixed on either device stays fixed)
- boss clears, best scores and history are kept from both
- an unfinished quiz, exam, mission or worksheet stays on the device where you started it

Each **player** (Wesley, Guest, a friend) syncs separately, by its own sync key.

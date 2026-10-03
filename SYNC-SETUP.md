# Sync your progress between devices

Open **⇅ Sync devices** in the sidebar, or tap the **⇅** button at the top. There are three ways to sync. You can use one or combine them.

## Option 1: Cloud sync (automatic, recommended)

Syncs by itself whenever you're online. It works from the downloaded folder, the web link, your phone and your laptop. It needs a free Supabase database, which you set up once (about 5 minutes).

1. Go to **supabase.com** → **Start your project** → sign in with GitHub or email.
2. **New project**. Any name (e.g. `study-terminal`), any database password, and the region closest to you (e.g. *US East*). Wait about a minute for it to finish.
3. In the left sidebar, open **SQL Editor** → **New query**. Paste the whole of **`sync-setup.sql`** from this folder, then click **Run**. You should see "Success. No rows returned."
4. Open **Project Settings → API** (or **Connect**). Copy:
   - the **Project URL** (`https://xxxx.supabase.co`)
   - the **anon / public** key (a long string starting `eyJ…`). Don't use the `service_role` key.
5. In the game: **Sync devices → Cloud sync → "I have the Project URL and anon key"**. Paste both, then **Save**.
6. Tap **Create a sync key**. Your progress uploads.
7. Still in Sync, tap **Pair another device**. On your phone, open the game → **Sync devices** → **Scan QR** (or paste the code under **Receive**). Done. Both devices now stay in step on their own.

**For your friend:** tap **Copy a setup code for them** and send it. They paste it under **Receive**, then tap **Create a sync key** for their own player. Their progress stays separate from yours.

**To skip step 5 on every device:** put the URL and anon key into `sync-config.js` in this folder, or send them to Claude to do it. Then every copy of the game is ready for cloud sync out of the box.

*Is the anon key safe to share?* Yes. It can only call the two sync functions, and only with a sync key it already knows. It can't list, read or delete anyone else's progress. Your **sync key** is what unlocks your progress, so only share it with your own devices.

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

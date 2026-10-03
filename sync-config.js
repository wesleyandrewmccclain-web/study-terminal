/* Cloud sync settings for everyone who plays this copy (optional).
   After you create the free Supabase project (see SYNC-SETUP.md), put its Project URL and
   anon/public key here so every device and friend gets cloud sync without pasting anything.
   The anon key is safe to share: it can only call the two sync functions, never list anyone's data. */
window.SYNC_CONFIG = {
  url: '',      // e.g. 'https://abcdefgh.supabase.co'
  anon: '',     // the long "anon public" key
  playUrl: 'https://wesleyandrewmccclain-web.github.io/study-terminal/'  // the GitHub Pages link
};

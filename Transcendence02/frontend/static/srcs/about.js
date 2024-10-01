function aboutView() {
  const section = `
	  <section aria-labelledby="aboutTitle">
		<h${th(2)} id="aboutTitle">About Our App</h${th(2)}>
		<p>Welcome to our app! Here you can enjoy various game modes, track your stats, connect with friends, and customize your settings.</p>
		<h${th(3)}>Key Features</h${th(3)}>
		<ul>
		  <li><strong>Game Modes:</strong> Play against AI, challenge another player in 1v1, or join a tournament with at least three players.</li>
		  <li><strong>Stats:</strong> View detailed statistics of your game matches.</li>
		  <li><strong>Players:</strong> Browse and view profiles of app players, and add them as friends.</li>
		  <li><strong>Friends:</strong> Manage your friends list and remove players if desired.</li>
		  <li><strong>Settings:</strong> Update your language preferences and user information.</li>
		</ul>
		<h${th(3)}>Accessibility</h${th(3)}>
		<ul>
		  <li><strong>High Color Contrast:</strong> Ensures text and interactive elements are easily distinguishable.</li>
		  <li><strong>Keyboard Navigation and Focus Management:</strong> All interactive elements are accessible via keyboard, with proper focus management.</li>
		  <li><strong>Options for Text Size:</strong> Users can adjust the text size for better readability.</li>
		</ul>
	  </section>
	`;

  return section;
}

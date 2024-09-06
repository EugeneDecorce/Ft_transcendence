function welcomeSectionView() {
  return `
		<section>
			<h2>Welcome</h2>
			<button class="btn btn-primary my-2" onclick="navigateTo('/auth/register')">Register</button>
			<button class="btn btn-secondary my-2" onclick="navigateTo('/auth/login')">Login</button>
			<button class="btn btn-success my-2" onclick="loginWith42()">Login with 42</button>
		</section>
	`;
}

function registerSectionView() {
  return `
	  <section>
		<h2>Register</h2>
		<form id="register" class="form-group">
		  <input type="text" id="register-username" class="form-control my-2" placeholder="Username" required />
		  <div class="input-group my-2">
			<input autocomplete="new-password" type="password" id="register-password" class="form-control" placeholder="Password" required />
			<span class="input-group-text"><i class="bi bi-eye-slash" id="toggle-password1"></i></span>
		  </div>
		  <div class="input-group my-2">
			<input autocomplete="new-password" type="password" id="register-password2" class="form-control" placeholder="Confirm password" required />
			<span class="input-group-text"><i class="bi bi-eye-slash" id="toggle-password2"></i></span>
		  </div>
		  <input type="email" id="register-email" class="form-control my-2" placeholder="Email" required />
		  <button type="submit" class="btn btn-primary">Register</button>
		</form>
		<p class="mt-3">Already have an account? <button id="show-login" class="btn btn-link" onclick="navigateTo('/auth/login')">Login here</button></p>
	  </section>
	`;
}

function loginSectionView() {
  return `
	  <section>
		<h2>Login</h2>
		<form id="login" class="form-group">
		  <input type="text" id="login-username" class="form-control my-2" placeholder="Username" required />
		  <div class="input-group my-2">
			<input autocomplete="new-password" type="password" id="login-password" class="form-control" placeholder="Password" required />
			<span class="input-group-text"><i class="bi bi-eye-slash" id="toggle-password1"></i></span>
		  </div>
		  <button type="submit" class="btn btn-primary">Login</button>
		</form>
		<p class="mt-3">Don't have an account? <button id="show-register" class="btn btn-link" onclick="navigateTo('/auth/register')">Register here</button></p>
	  </section>
	`;
}

function notFoundSectionView() {
  return `
		<section>
		  <h2>Page not found</h2>
		</section>
	  `;
}

function getWelcomeSection() {
  const section = welcomeSectionView();
  return section;
}

function getRegisterSection() {
  const section = registerSectionView();
  setTimeout(registerFormEventListener, 0);
  return section;
}

function getLoginSection() {
  const section = loginSectionView();
  setTimeout(loginFormEventListener, 0);
  return section;
}

function getNotFoundSection() {
  const section = notFoundSectionView();
  return section;
}

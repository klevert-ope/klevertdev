<script lang="ts">
  import IoLogoGithub from "svelte-icons/io/IoLogoGithub.svelte";

  let currentYear: number;
  const date = new Date();
  currentYear = date.getFullYear();
</script>

<section class="padding-y container">
  <h1
    class="padding-y font-xl text-center font-bold opera-font yellow-blue-text">
    Get In
    Touch</h1>
  <div class="flex-col-center padding-y">
    <a
      class="text-underline font-xs font-light black-white-text letter-space-xs mail"
      href="mailto:inquiries@klevertopee.app"
    >
      inquiries@klevertopee.app
    </a>
    <a
      class="padding-top"
      href="https://github.com/klevert-ope"
      target="_blank"
    >
      <div class="icon-git">
        <IoLogoGithub />
      </div>
    </a>
  </div>
  <div class="padding-top flex-col-center">
    <small class="font-xs font-semi-bold">
      Klevert &copy; {currentYear} All rights reserved.
    </small>
  </div>
</section>

<style>
	.opera-font {
		font-family: 'Opera', sans-serif;
		}

	.yellow-blue-text {
		color: var(--orange-blue);
		}

	.black-white-text {
		color: var(--white-black);
		}

	.icon-git {
		width: 26px;
		height: 26px;
		color: var(--white-black);
		}

	.font-xs {
		font-size: calc(clamp(0.65rem, 0.6062rem + 0.1798vw, 0.75rem));
		}

	.font-xl {
		font-size: calc(clamp(1.7rem, 1.3933rem + 1.2584vw, 2.4rem));
		}

	.font-light {
		font-weight: 300;
		}

	.font-semi-bold {
		font-weight: 600;
		}

	.font-bold {
		font-weight: 700;
		}

	.text-center {
		text-align: center;
		}

	.text-underline {
		text-decoration-line: underline;
		text-decoration-skip-ink: none;
		text-underline-offset: 5px;
		}

	.flex-col-center {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		}

	.padding-top {
		padding-top: 20px;
		}

	.padding-y {
		padding-top: 20px;
		padding-bottom: 20px;
		}

	.letter-space-xs {
		letter-spacing: 4px;
		}
</style>


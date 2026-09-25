# `just --list --unsorted`
[group('default')]
default:
    @just --list --unsorted

ci := env("CI", "")

# Install dependencies
[group('setup')]
install:
    vp install

# Install the Playwright browser used by the e2e tests
[group('setup')]
install-browsers: install
    vp exec playwright install chromium

# Run Astro dev server
dev *args: install
    vp run dev {{ args }}

# Run linter
lint: install
    vp lint {{ if ci != "" { "--format github" } else { "--fix" } }}

# Run formatter
format: install
    vp fmt {{ if ci != "" { "--check" } else { "" } }}

# Run checks (format + lint + typecheck)
check *args: install
    vp run --cache check {{ if ci != "" { "" } else { "--fix" } }} {{ args }}

# Run unit tests
test *args: install
    vp run --cache test:run {{ args }}

# Run end-to-end tests against a production build
test-e2e *args: install
    vp run test:e2e {{ args }}

# Type-check the project, including .astro files
typecheck: install
    vp run typecheck

# Build the site to dist/
build: install
    vp run build

# Preview the production build
preview: build
    vp run preview

# Apply safe Fallow fixes locally, then reject remaining dead code
fallow: install
    {{ if ci == "" { "vp run fallow" } else { "true" } }}
    vp run fallow:ci

# vp run fallow:ci
fallow-check: install
    vp run fallow:ci

# Run pre-commit hooks on all files (same as CI's pre-commit job)
pre-commit: install
    pre-commit run --all-files

# Run all pre-commit checks
[arg("quick", long, value="true", help="Skip tests")]
verify quick="": check typecheck build fallow pre-commit
    {{ if quick != "true" { "just test && just test-e2e" } else { "true" } }}
    @echo "All pre-commit checks passed!"

# Deprecated alias for `verify`
[arg("quick", long, value="true", help="Skip tests")]
precommit quick="": (verify quick)

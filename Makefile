lint:
	./node_modules/.bin/eslint .

run:
	./node_modules/.bin/web-ext run --target chromium --start-url "chrome://extensions" -s src/

.PHONY: lint run

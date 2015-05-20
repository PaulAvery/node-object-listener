BIN = ./node_modules/.bin

build:
	@$(BIN)/tsc

clean:
	@rm -rf lib

test: build lint
	@$(BIN)/mocha --harmony --require must

lint:
	@$(BIN)/eslint test

release-major: test
	@$(BIN)/bump --major

release-minor: test
	@$(BIN)/bump --minor

release-patch: test
	@$(BIN)/bump --patch

publish:
	git push --tags origin HEAD:master
	npm publish

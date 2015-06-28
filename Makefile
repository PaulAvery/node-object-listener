BIN = ./node_modules/.bin

build:
	@$(BIN)/tsc
	@$(BIN)/dts-generator --name object-listener --main object-listener/ObjectListener --out lib/object-listener.d.ts --baseDir src ObjectListener.ts

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

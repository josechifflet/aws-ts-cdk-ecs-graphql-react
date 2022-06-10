ifneq (,$(wildcard .env))
    include .env
    export
endif

.PHONY: deploy destroy synth

deploy:
	if [ ! -d infra/node_modules ]; then \
		cd infra && npm install && cd -; \
	fi
	if [ ! -d frontend/node_modules ]; then \
		cd frontend && npm install && cd -; \
	fi
	cd frontend && npm run build && cd -
	make bootstrap
	cd infra && npx cdk --profile ${AWS_PROFILE} deploy --all --require-approval never && cd -

deploy_back:
	if [ ! -d infra/node_modules ]; then \
		cd infra && npm install && cd -; \
	fi
	cd infra && npx cdk --profile ${AWS_PROFILE} deploy FargateDemoStack && cd -

destroy:
	cd infra && npx cdk --profile ${AWS_PROFILE} destroy --all && cd -

force_destroy:
	cd infra && npx cdk --profile ${AWS_PROFILE} destroy  -f --all && cd -

bootstrap:
	cd infra && npx cdk --profile ${AWS_PROFILE} bootstrap --force --all && cd -

synth:
	cd infra && npx cdk --profile ${AWS_PROFILE} synth --all && cd -


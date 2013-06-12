SRC := src
DST := lib
COFFEE := node_modules/.bin/coffee

SRC_FILES := $(shell find $(SRC) -type f -name "*.coffee")
DST_FILES := $(SRC_FILES:$(SRC)/%.coffee=$(DST)/%.js)

all: $(DST_FILES)

clean:
	rm $(DST)/* -v

$(DST)/%.js: $(SRC)/%.coffee
	mkdir -p $(@D)
	$(COFFEE) --compile --stdio < $< > $@

.PHONY: all clean
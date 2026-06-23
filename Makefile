# 校园最短路径导航系统 Makefile

CC = gcc
CFLAGS = -Wall -Wextra -std=c99 -Iinclude
SRCS = src/main.c src/graph.c
TARGET = bin/campus_nav

# Windows 与 POSIX 兼容
ifeq ($(OS),Windows_NT)
	TARGET := $(TARGET).exe
endif

.PHONY: build run export clean

build: $(TARGET)

$(TARGET): $(SRCS)
	@mkdir -p bin
	$(CC) $(CFLAGS) $(SRCS) -o $(TARGET)

run: build
	./$(TARGET)

export: build
	./$(TARGET) --export

clean:
	rm -f $(TARGET)
	rm -f $(EXPORT_PATH)

clean-data:
	rm -f assets/data/routes.json

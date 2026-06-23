# 校园最短路径导航系统 Makefile

CC = gcc
CFLAGS = -Wall -Wextra -std=c99 -Iinclude
SRC = src/main.c
TARGET = bin/campus_nav

# Windows 与 POSIX 兼容
ifeq ($(OS),Windows_NT)
	TARGET := $(TARGET).exe
endif

.PHONY: build run export clean

build: $(TARGET)

$(TARGET): $(SRC)
	@mkdir -p bin
	$(CC) $(CFLAGS) $(SRC) -o $(TARGET)

run: build
	./$(TARGET)

export: build
	./$(TARGET) --export

clean:
	rm -f $(TARGET)

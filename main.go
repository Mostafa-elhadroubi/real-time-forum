package main

import (
	"realTimeForum/functions"
)

func main() {
	functions.CreateDatabase()
	functions.Routers()
}

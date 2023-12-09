// main.go
package main

import (
	"encoding/json"
	"net/http"
	"sort"
	"sync"
	"time"
)

type RequestBody struct {
	ToSort [][]int `json:"to_sort"`
}

type ResponseBody struct {
	SortedArrays [][]int `json:"sorted_arrays"`
	TimeNs       int64   `json:"time_ns"`
}

func main() {
	http.HandleFunc("/process-single", processSingle)
	http.HandleFunc("/process-concurrent", processConcurrent)
//	http.Handle("/", http.FileServer(http.Dir("frontend")))
	http.ListenAndServe(":8000", nil)
}

func processSingle(w http.ResponseWriter, r *http.Request) {
	var requestBody RequestBody
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	startTime := time.Now()
	sortedArrays := sortSequential(requestBody.ToSort)
	timeTaken := time.Since(startTime).Nanoseconds()

	response := ResponseBody{SortedArrays: sortedArrays, TimeNs: timeTaken}
	sendResponse(w, response)
}

func processConcurrent(w http.ResponseWriter, r *http.Request) {
	var requestBody RequestBody
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	startTime := time.Now()
	sortedArrays := sortConcurrent(requestBody.ToSort)
	timeTaken := time.Since(startTime).Nanoseconds()

	response := ResponseBody{SortedArrays: sortedArrays, TimeNs: timeTaken}
	sendResponse(w, response)
}

func sortSequential(arrays [][]int) [][]int {
	for i := range arrays {
		sort.Ints(arrays[i])
	}
	return arrays
}

func sortConcurrent(arrays [][]int) [][]int {
	var wg sync.WaitGroup
	wg.Add(len(arrays))

	for i := range arrays {
		go func(i int) {
			defer wg.Done()
			sort.Ints(arrays[i])
		}(i)
	}

	wg.Wait()
	return arrays
}

func sendResponse(w http.ResponseWriter, response ResponseBody) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}


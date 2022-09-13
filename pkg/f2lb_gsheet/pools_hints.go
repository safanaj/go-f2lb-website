package f2lb_gsheet

import (
	"encoding/csv"
	"os"
)

func getHintsMapping(path string) map[string]string {
	if path == "" {
		return nil
	}
	f, err := os.Open(path)
	if err != nil {
		return nil
	}
	records, err := csv.NewReader(f).ReadAll()
	if err != nil || len(records) == 0 {
		return nil
	}
	if records[0][0] == "ticker" {
		records = records[1:]
	}
	mapping := make(map[string]string)
	for _, r := range records {
		mapping[r[0]] = r[1]
	}
	return mapping
}

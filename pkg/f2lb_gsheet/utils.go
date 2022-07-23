package f2lb_gsheet

import (
	"strings"
)

type CacheWarn struct{ warnings []string }

func (e *CacheWarn) Error() string { return strings.Join(e.warnings, "\n") }

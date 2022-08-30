package f2lb_members

// this is a struct to take the values from the main queue sheet
type FromMainQueueValues struct {
	// columns
	DiscordName string `json:"discord_name" yaml:"discord_name"`                                 // A
	QPP         uint16 `json:"qpp" yaml:"qpp"`                                                   // B
	Ticker      string `json:"ticker" yaml:"ticker"`                                             // C
	AD          uint16 `json:"ada_declared" yaml:"ada_declared"`                                 // D
	EG          uint16 `json:"epoch_granted" yaml:"epoch_granted"`                               // E
	EGAQ        uint16 `json:"epoch_granted_on_addon_queue" yaml:"epoch_granted_on_addon_queue"` // E

	// other columns
	DelegStatus  string // F
	MainQCurrPos uint16 // G
	AddonQStatus string // H

	// computed column I
	StakeKeys  []string `json:"stake_keys" yaml:"stake_keys"`
	StakeAddrs []string `json:"stake_addresses" yaml:"stake_addresses"`

	MissedEpochs       string // J
	AddedToGoogleGroup string // K
	// PoolIdHex             string // L
	// PoolIdBech32          string
	DiscordID             string // M
	InitialAdaDeclaration string // N

	// from Deleg. Cycle sheet and/or computed
	StartingEpochOnMainQueue  uint16 `json:"starting_epoch_on_main_queue" yaml:"starting_epoch_on_main_queue"`
	StartingEpochOnAddonQueue uint16 `json:"starting_epoch_on_addon_queue" yaml:"starting_epoch_on_addon_queue"`
}

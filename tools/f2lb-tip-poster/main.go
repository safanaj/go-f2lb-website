package main

import (
	"crypto"
	"crypto/ed25519"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/spf13/cobra"
	structpb "google.golang.org/protobuf/types/known/structpb"

	v2 "github.com/safanaj/go-f2lb/pkg/api/v2"
	"github.com/safanaj/go-f2lb/pkg/utils"
)

var rootCmd = &cobra.Command{
	Use:   "f2lb-tip-poster",
	Short: "A brief description of your application",
	Long: `A longer description that spans multiple lines and likely contains
examples and usage of using your application. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	// Uncomment the following line if your bare application
	// has an action associated with it:
	// Run: func(cmd *cobra.Command, args []string) { },
}

var signCmd = &cobra.Command{
	Use:   "sign",
	Short: "A brief description of your application",
	Long: `A longer description that spans multiple lines and likely contains
examples and usage of using your application. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	// Uncomment the following line if your bare application
	// has an action associated with it:
	// Run: func(cmd *cobra.Command, args []string) { },
	RunE: func(cmd *cobra.Command, args []string) error {
		sKeyFilePath, _ := cmd.Flags().GetString("vrf-skey-file")
		msg, _ := cmd.Flags().GetString("message")

		prvKey, err := utils.GetVRFSigningKeyAsEdDSAPrivateKeyFromJSONFile(sKeyFilePath)
		if err != nil {
			return err
		}

		cborPubKey, err := utils.GetCBORHexFromBytes(prvKey.Public().(ed25519.PublicKey))
		if err != nil {
			return err
		}

		sig, err := prvKey.Sign(nil, []byte(msg), crypto.Hash(0))
		if err != nil {
			return err
		}
		enc := json.NewEncoder(os.Stdout)
		enc.SetIndent("", "  ")
		enc.Encode(map[string]any{
			"message":       msg,
			"cborPublicKey": cborPubKey,
			"signature":     hex.EncodeToString(sig),
		})

		return nil
	},
}

var verifyCmd = &cobra.Command{
	Use:   "verify",
	Short: "A brief description of your application",
	Long: `A longer description that spans multiple lines and likely contains
examples and usage of using your application. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	// Uncomment the following line if your bare application
	// has an action associated with it:
	// Run: func(cmd *cobra.Command, args []string) { },
	RunE: func(cmd *cobra.Command, args []string) error {
		vKeyFilePath, _ := cmd.Flags().GetString("vrf-vkey-file")
		msg, _ := cmd.Flags().GetString("message")
		sig, _ := cmd.Flags().GetString("signature")

		pubKey, err := utils.GetVRFVerificationKeyAsEdDSAPrivateKeyFromJSONFile(vKeyFilePath)
		if err != nil {
			return err
		}
		sigBytes, err := hex.DecodeString(sig)
		if err != nil {
			return err
		}
		if !ed25519.Verify(pubKey, []byte(msg), sigBytes) {
			return fmt.Errorf("Signature is not verified")
		}
		fmt.Println("Signature is verified")

		return nil
	},
}

var postCmd = &cobra.Command{
	Use:   "post",
	Short: "A brief description of your application",
	Long: `A longer description that spans multiple lines and likely contains
examples and usage of using your application. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	// Uncomment the following line if your bare application
	// has an action associated with it:
	// Run: func(cmd *cobra.Command, args []string) { },
	RunE: func(cmd *cobra.Command, args []string) error {
		sKeyFilePath, _ := cmd.Flags().GetString("vrf-skey-file")
		poolTicker, _ := cmd.Flags().GetString("pool-ticker")
		msg, _ := cmd.Flags().GetString("message")
		sigType, _ := cmd.Flags().GetString("signature-type")

		prvKey, err := utils.GetVRFSigningKeyAsEdDSAPrivateKeyFromJSONFile(sKeyFilePath)
		if err != nil {
			return err
		}

		cborPubKey, err := utils.GetCBORHexFromBytes(prvKey.Public().(ed25519.PublicKey))
		if err != nil {
			return err
		}

		sig, err := prvKey.Sign(nil, []byte(msg), crypto.Hash(0))
		if err != nil {
			return err
		}

		var data map[string]any
		if err := json.NewDecoder(strings.NewReader(msg)).Decode(&data); err != nil {
			return err
		}

		payload := new(v2.TipPayload)
		payload.Type = sigType
		payload.PublicKey = cborPubKey
		payload.Pool = poolTicker
		payload.Signature = hex.EncodeToString(sig)
		payload.Data, _ = structpb.NewStruct(data)

		var body strings.Builder
		if err := json.NewEncoder(&body).Encode(payload); err != nil {
			return err
		}

		resp, err := http.Post("https://f2lb.bardels.me/api/v2/report/tip",
			"application/json", strings.NewReader(body.String()))
		if err != nil {
			return err
		}
		resp.Body.Close()

		fmt.Printf("F2LB reported tip, response status code: %s\n", resp.Status)
		if resp.StatusCode != http.StatusOK {
			return fmt.Errorf("failed: (%d) %s", resp.StatusCode, resp.Status)
		}
		return nil
	},
}

func init() {
	signCmd.Flags().String("vrf-skey-file", "", "VRF Signing Key file path")
	postCmd.Flags().String("vrf-skey-file", "", "VRF Signing Key file path")
	signCmd.Flags().String("message", "", "message to sign")
	postCmd.Flags().String("message", "", "message to sign and post")
	postCmd.Flags().String("pool-ticker", "", "pool ticker")
	postCmd.Flags().String("signature-type", "f2lb", "one of f2lb or minimal-f2lb")

	verifyCmd.Flags().String("vrf-vkey-file", "", "VRF Verification Key file path")
	verifyCmd.Flags().String("signature", "", "Signature to verify")
	verifyCmd.Flags().String("message", "", "message to verify")

	rootCmd.AddCommand(signCmd)
	rootCmd.AddCommand(verifyCmd)
	rootCmd.AddCommand(postCmd)
}

func main() {
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}

import { Blob } from "buffer";

export function getBlob(arrayBuffer) {

	// Blobを生成する
	var blob = new Blob([arrayBuffer], { type: "image/png" });
	console.log(blob);

	// BlobをBlobURLスキームに変換して、img要素にセットする。
	var blob_url = window.URL.createObjectURL(blob);
	return blob_url
}

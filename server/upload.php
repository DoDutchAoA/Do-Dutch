<?php
$target_dir = "upload/images";
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}
$target_dir = $target_dir."/".rand()."_".time().".jpg";

if (move_uploaded_file($_FILES['image']['tmp_name'], $target_dir)) {
    echo shell_exec("python OCR/main.py ".$target_dir." output/output.jpg output/output.pdf");
    // echo json_encode([
    // #"Message" => "The file has been uploaded.",
    // "Status" => "OK"
    // ]);
} else {
    echo json_encode([
        "Message" => "Erro when uploading image.",
        "Status" => "Error"
    ]);
}

?>

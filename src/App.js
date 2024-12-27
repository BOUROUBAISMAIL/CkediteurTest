import React, { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function App() {
  const [editorContent, setEditorContent] = useState('');
  const editorRef = useRef(null);

  const handleEditorChange = (content, editor) => {
    setEditorContent(content); // Update state when content changes in the first editor
  };

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  return (
    <>
      {/* First Editor */}
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={editorContent}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'a11ychecker', 'advlist', 'advcode', 'advtable', 'autolink', 'checklist', 'export',
            'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks',
            'powerpaste', 'fullscreen', 'formatpainter', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
          ],
          toolbar:
            'undo redo | casechange blocks | bold italic backcolor | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist checklist outdent indent | removeformat | ' +
            'a11ycheck code table help | image',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          image_title: true, // Enable the image title field
          automatic_uploads: true, // Automatically upload images when inserted
          images_upload_url: 'http://localhost:5000/upload', // Your server-side endpoint
          file_picker_types: 'image', // Enable only image file types in the file picker
          file_picker_callback: (callback, value, meta) => {
            if (meta.filetype === 'image') {
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');

              input.onchange = function () {
                const file = this.files[0];

                // Create a FormData object to send the file
                const formData = new FormData();
                formData.append('upload', file);

                // Make the POST request to the server
                fetch('http://localhost:5000/upload', {
                  method: 'POST',
                  body: formData,
                })
                  .then(response => response.json())
                  .then(data => {
                    if (data.uploaded) {
                      // If the upload is successful, use the URL returned by the server
                      callback(data.url, { title: file.name });
                    } else {
                      console.error('Upload failed');
                    }
                  })
                  .catch(error => {
                    console.error('Error uploading file:', error);
                  });
              };

              input.click();
            }
          },

          // On change, update the state with the new content
          setup: (editor) => {
            editor.on('Change', () => {
              handleEditorChange(editor.getContent(), editor);
            });
          }
        }}
      />
      <button onClick={log}>Log editor content</button>

      {/* Second Read-only Editor */}
      <Editor
        disabled={true} // Disable the editor
        value={editorContent} // Bind content to state for display
        init={{
          height: 500,
          menubar: false, // Hide the menubar
          toolbar: false, // Hide the toolbar
          statusbar: false, // Hide the statusbar
          readonly: true, // Set read-only mode
          plugins: [],
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
      />
    </>
  );
}

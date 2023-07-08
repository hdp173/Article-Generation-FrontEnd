import "./App.css";
import { Form, FormGroup, Label, Input, Button, Col } from "reactstrap";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const baseUrl = "https://article-generation-backend-zuc5u.ondigitalocean.app";

function App() {
  const [trainFile, setTrainFile] = useState(null);
  const [topicsFile, setTopicsFile] = useState(null);
  const [indexes, setIndexes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [newIndex, setNewIndex] = useState("");
  const [isTraining, setIsTraining] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);

  const fetchPrompt = (index) => {
    const formData = new FormData();
    formData.append("index", index);
    fetch(`${baseUrl}/get-prompt`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => setCurrentPrompt(result));
  };
  const uploadTrainFile = () => {
    setIsTraining(true);
    const formData = new FormData();
    formData.append("file", trainFile);
    formData.append("index", currentIndex);
    fetch(`${baseUrl}/train-data`, {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        setIsTraining(false);
        const result = await response.json();
        alert("Succeed");
        console.log(result);
      })
      .catch((error) => {
        alert("failed");
        setIsTraining(false);
      });
  };
  const handleIndexChange = (e) => {
    setCurrentIndex(e.target.value);
    fetchPrompt(e.target.value);
  };

  const savePrompt = () => {
    const formData = new FormData();
    formData.append("index", currentIndex);
    formData.append("prompt", currentPrompt);
    fetch(`${baseUrl}/save-prompt`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(() => alert("Succed"));
  };

  const addIndex = () => {
    const formData = new FormData();
    formData.append("index", newIndex);
    formData.append("prompt", currentPrompt);
    fetch(`${baseUrl}/save-prompt`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(() => {
        alert("Succed");
        setIndexes([...indexes, newIndex]);
      });
  };

  const generateArticle = () => {
    setIsGenerating(true);
    const formData = new FormData();
    formData.append("file", topicsFile);
    formData.append("index", currentIndex);
    fetch(`${baseUrl}/generate-article`, {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        const result = await response.json();
        alert("Succeed");
        setIsGenerating(false);
        console.log(result);
      })
      .catch((error) => {
        alert("failed");
        console.log(error);
        setIsGenerating(false);
      });
  };
  const generateQuestion = () => {
    setIsGeneratingQuestion(true);
    const formData = new FormData();
    formData.append("file", trainFile);
    fetch(`${baseUrl}/generate-question`, {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        const result = await response.json();
        alert("Succeed");
        setIsGeneratingQuestion(false);
      })
      .catch((error) => {
        alert("failed");
        console.log(error);
        setIsGeneratingQuestion(false);
      });
  };
  useEffect(() => {
    fetch(`${baseUrl}/get-all-prompts`)
      .then((response) => response.json())
      .then((data) => {
        setIndexes(data);
        setCurrentIndex(data[0]);
        fetchPrompt(data[0]);
      });
  }, []);
  return (
    <div>
      <main className="mt-5">
        <Form>
          <FormGroup row>
            <Label sm={1} for="train_file" style={{ textAlign: "right" }}>
              Select Index
            </Label>
            <Col sm={6}>
              <Input
                type="select"
                name="index"
                id="index"
                onChange={handleIndexChange}
              >
                {indexes.map((index) => (
                  <option value={index}>{index}</option>
                ))}
              </Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={1} for="train_file" style={{ textAlign: "right" }}>
              Prompt
            </Label>
            <Col sm={6}>
              <textarea
                name="prompt"
                id="prompt"
                style={{ width: "100%", height: "500px" }}
                value={currentPrompt}
                onChange={(e) => setCurrentPrompt(e.target.value)}
              ></textarea>
              <Col sm={2}>
                <Button onClick={savePrompt} className="btn-primary">
                  Save
                </Button>
              </Col>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={1} for="train_file" style={{ textAlign: "right" }}>
              New Index
            </Label>
            <Col sm={6}>
              <Input
                name="new_index"
                id="new_index"
                value={newIndex}
                onChange={(e) => setNewIndex(e.target.value)}
              />
            </Col>
            <Col sm={2}>
              <Button onClick={addIndex}>Add New Index</Button>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={1} for="train_file" style={{ textAlign: "right" }}>
              Choose Train File
            </Label>
            <Col sm={6}>
              <Input
                id="train_file"
                name="train_file"
                type="file"
                onChange={(e) => setTrainFile(e.target.files[0])}
              />
            </Col>
            {trainFile && (
              <Col sm={2}>
                <Button onClick={uploadTrainFile} disabled={isTraining}>
                  Upload Train Data
                </Button>
              </Col>
            )}
            {trainFile && trainFile.name.endsWith(".pdf") && (
              <Col sm={2}>
                <Button
                  onClick={generateQuestion}
                  disabled={isGeneratingQuestion}
                >
                  Generate Question
                </Button>
              </Col>
            )}
          </FormGroup>
          <FormGroup row>
            <Label sm={1} for="train_file" style={{ textAlign: "right" }}>
              Choose Topics Files
            </Label>
            <Col sm={6}>
              <Input
                id="topic_file"
                name="topic_file"
                type="file"
                onChange={(e) => setTopicsFile(e.target.files[0])}
              />
            </Col>
            {topicsFile && (
              <Col sm={2}>
                <Button onClick={generateArticle} disabled={isGenerating}>
                  Generate Article
                </Button>
              </Col>
            )}
          </FormGroup>
        </Form>
      </main>
    </div>
  );
}

export default App;

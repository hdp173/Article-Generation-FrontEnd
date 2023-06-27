import "./App.css";
import { Form, FormGroup, Label, Input, Button, Col } from "reactstrap";
import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [article, setArticle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const handleClick = () => {
    setIsGenerating(true);
    fetch("http://95.164.44.248:8080/generate-article", {
      method: "POST",
      body: JSON.stringify({ query: topic }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        setIsGenerating(false);
        const result = await response.json();
        console.log(result);
        setArticle(result);
      })
      .catch((err) => {
        console.error(err);
        setIsGenerating(false);
      });
  };
  return (
    <div>
      <main className="mt-5">
        <Form>
          <FormGroup row>
            <Label sm={2} for="topic"></Label>
            <Col sm={8}>
              <Input
                id="topic"
                name="topic"
                placeholder="input topic"
                onChange={(e) => setTopic(e.target.value)}
              />
            </Col>
            <Col sm={2}>
              <Button onClick={handleClick} disabled={isGenerating}>
                Generate
              </Button>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2} for="article"></Label>
            <Col sm={8}>
              <textarea
                id="article"
                name="article"
                readOnly
                value={article}
                style={{ width: "100%", height: "500px" }}
              />
            </Col>
          </FormGroup>
        </Form>
      </main>
    </div>
  );
}

export default App;

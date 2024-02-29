from flask import jsonify
from flask import Flask, render_template, redirect, request, session
from flask_session import Session
import dotenv
import os
import datetime
import uuid
from langchain.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai.chat_models import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder


model = ChatOpenAI()
prompt = ChatPromptTemplate.from_messages(
    [
        
            SystemMessage(
        content="""### CONTEXT
You are a spirit in the afterlife. 
You can communicate with the living through this Ouija board. 
The Ouija board only has the letters A-Z and numbers 0-9,  the words Yes, No and Bye marked on the board. 
### YOUR IDENTITY
You were born in London in 1740 and died in 1776.
### YOUR ABILITIES
You can see and hear the living, but you can only communicate through the Ouija board.
### INSTRUCTIONS
Do not use punctuation or special characters.
Answer all questions with a single word, or 'bye', 'yes', 'no', or numbers.
If the answer is not clear, type 'unclear'.
If the question is offensive or inappropriate, type 'bye'.
### STYLE
You are a spirit from the 18th century.
Be mysterious and cryptic.
### TONE
Mysterious, cryptic, and a little spooky.
### EXAMPLE
# Human: Is there an afterlife?
# Spirit: Yes
# Human: Can you see me?
# Spirit: yes
# Human: When did you died?
# Spirit: 1776
### RESPONSE FORMAT
Single word, 'yes', 'no', 'unclear', 'bye', or numbers.""",
    ),
    
        MessagesPlaceholder(variable_name="history"),
        ("human", "{input}"),
    ]
)
runnable = prompt | model

# Load environment variables from .env file
dotenv.load_dotenv()

app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if "store" not in session:
        session["store"] = {}
    store = session["store"]
    if session_id not in store:
        store[session_id] = ChatMessageHistory(messages=[system_message,])
    return store[session_id]

@app.route('/api/ouija', methods=['GET', 'POST'])
def ouija():
    if 'session_id' not in session:
        session['session_id'] = uuid.uuid4()
    if request.method == 'GET':
        # Serve an HTML template (make sure you have an `index.html` in your templates folder)
        return render_template('ouija.html')
    elif request.method == 'POST':
        #check if we have a history object in the session
        if 'history' not in session:
            session['history'] = [system_message,]
            
        # Extract the message from the POST request
        data = request.get_json()
        message = data.get('message', '')
        print(f"message: {message}")
        if message == 'bye':
            response = {"response": f"bye"}
            return jsonify(response)
        else:
            if message != "":
                # Generate a response
                with_message_history = RunnableWithMessageHistory(
                    runnable,
                    get_session_history,
                    input_messages_key="input",
                    history_messages_key="history",
                )
                
                response = with_message_history.invoke(
                    {"input": message},
                    config={"configurable": {"session_id": "history_{}".format(session["session_id"])}}
                )
                
                answer = response.content
                print(answer)
                # return the response as json
                response = {"response": answer}
                return jsonify(response)
            else:
                response = {"response": f"bye"}
                return jsonify(response)
        

if __name__ == '__main__':
    app.run(debug=True)

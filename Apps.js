import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function App() {
  // Chat State
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello!', sender: 'other' },
    { id: '2', text: 'Hi! How are you?', sender: 'me' },
    { id: '3', text: 'I’m okay love!', sender: 'other' },
  ]);
  const [input, setInput] = useState('');

  // Comments State
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);

  // Send Chat Message
  const sendMessage = () => {
    if (input.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'me',
    };

    setMessages([...messages, newMessage]);
    setInput('');
  };

  // Add Comment
  const addComment = () => {
    if (newComment.trim() === '') return;

    const comment = {
      id: Date.now().toString(),
      text: newComment,
      replies: [],
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  // Add Reply
  const addReply = (commentId) => {
    if (!replyText[commentId] || replyText[commentId].trim() === '') return;

    const updatedComments = comments.map((c) =>
      c.id === commentId
        ? {
            ...c,
            replies: [
              ...c.replies,
              { id: Date.now().toString(), text: replyText[commentId] },
            ],
          }
        : c
    );

    setComments(updatedComments);
    setReplyText({ ...replyText, [commentId]: '' });
    setReplyingTo(null);
  };

  // Render Chat Message
  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.message,
        item.sender === 'me' ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  // Render Comment with Replies
  const renderComment = ({ item }) => (
    <View style={styles.commentBubble}>
      <Text style={styles.commentText}>{item.text}</Text>

      {/* Replies */}
      {item.replies.map((reply) => (
        <View key={reply.id} style={styles.replyBubble}>
          <Text style={styles.replyText}>{reply.text}</Text>
        </View>
      ))}

      {/* Reply Button */}
      {replyingTo === item.id ? (
        <View style={styles.replyInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Write a reply..."
            value={replyText[item.id] || ''}
            onChangeText={(text) =>
              setReplyText({ ...replyText, [item.id]: text })
            }
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => addReply(item.id)}
          >
            <Text style={styles.sendText}>Reply</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.replyButton}
          onPress={() => setReplyingTo(item.id)}
        >
          <Text style={{ color: '#007AFF' }}>Reply</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Chat Section */}
        <Text style={styles.sectionTitle}>Chat</Text>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          style={styles.flatList}
          scrollEnabled={false}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>

        {/* Comment Section */}
        <Text style={styles.sectionTitle}>Comments</Text>
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={renderComment}
          style={styles.flatList}
          scrollEnabled={false}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity style={styles.sendButton} onPress={addComment}>
            <Text style={styles.sendText}>Post</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollArea: { flex: 1, paddingHorizontal: 10 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  flatList: { flexGrow: 0 },
  message: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '70%',
  },
  myMessage: { backgroundColor: '#DCF8C6', alignSelf: 'flex-end' },
  otherMessage: { backgroundColor: '#EEE', alignSelf: 'flex-start' },
  messageText: { fontSize: 16 },
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    borderRadius: 20,
  },
  sendText: { color: '#fff', fontWeight: 'bold' },
  commentBubble: {
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    alignSelf: 'flex-start',
    maxWidth: '90%',
  },
  commentText: { fontSize: 16, color: '#333' },
  replyBubble: {
    backgroundColor: '#E6F0FF',
    borderRadius: 8,
    padding: 8,
    marginLeft: 20,
    marginTop: 5,
  },
  replyText: { fontSize: 15, color: '#333' },
  replyButton: { marginTop: 5, marginLeft: 5 },
  replyInputContainer: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
});
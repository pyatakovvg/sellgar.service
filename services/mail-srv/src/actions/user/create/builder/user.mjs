
export default function(data) {
  return {
    login: data['login'],
    role: data['role']['displayName'],
  };
}

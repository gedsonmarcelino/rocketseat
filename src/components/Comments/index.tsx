import React from 'react';

/**
 * Instance a utterances service comments.
 * 
 * @param commentNodeId string
 * @param repoName string
 */
const useUtterances = (commentNodeId: string, repoName: string) => {
  React.useEffect(() => {
    const scriptParentNode = document.getElementById(commentNodeId)
    if (!scriptParentNode) return

    // docs - https://utteranc.es/
    const script = document.createElement('script')
    script.src = 'https://utteranc.es/client.js'
    script.async = true
    script.setAttribute('repo', repoName)
    script.setAttribute('issue-term', 'pathname')
    script.setAttribute('label', 'comment :speech_balloon:')
    script.setAttribute('theme', 'photon-dark')
    script.setAttribute('crossorigin', 'anonymous')

    scriptParentNode.appendChild(script)

    return () => {
      // cleanup - remove the older script with previous theme
      scriptParentNode.removeChild(scriptParentNode.firstChild as Node)
    }
  }, [commentNodeId])
}

interface CommentsProps {
  id: string;
  repo: string;
}

export const Comments = ({ id, repo }: CommentsProps) => {
  useUtterances(id, repo)
  return <div id="comment"></div>
}
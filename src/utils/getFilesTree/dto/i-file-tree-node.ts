export default interface IFileTreeNode {
  name: string;
  type: 'dir' | 'file';
  content: IFileTreeNode[];
}

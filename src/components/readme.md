### 组件之间依赖使用相对路径
```jsx
import NvaTabProvider from '../provider/NvaTabProvider';
```
### 外部依赖需通过index.tsx统一export
```jsx
import { AppLayout, NvaTab } from 'planets';
```
#### 避免循环依赖